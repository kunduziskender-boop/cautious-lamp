# Opens local photographer portfolio via Python http.server.

$ErrorActionPreference = 'Stop'

Set-Location -LiteralPath $PSScriptRoot
$Port = 9333
$indexFsPath = Join-Path $PSScriptRoot 'index.html'

function Test-PortOpen([int]$P) {
    try {
        $c = New-Object System.Net.Sockets.TcpClient
        $c.Connect('127.0.0.1', $P)
        $c.Close()
        return $true
    } catch {
        return $false
    }
}

function Escape-CmdArg([string]$s) {
    if ($null -eq $s) { return '""' }
    if ($s.Contains(' ') -or $s.Contains('&') -or $s.Contains('"')) {
        return '"' + ($s.Replace('"', '""')) + '"'
    }
    return $s
}

function Resolve-PythonExec {
    foreach ($name in @('py.exe','python.exe','python3.exe')) {
        $cmdInfo = Get-Command $name -CommandType Application -ErrorAction SilentlyContinue |
            Select-Object -First 1
        if (-not $cmdInfo) { continue }

        return [pscustomobject]@{
            Path        = $cmdInfo.Source
            PreferDash3 = ($name -eq 'py.exe')
        }
    }
    return $null
}

$pyHost = Resolve-PythonExec
if (-not $pyHost) {
    Write-Host ''
    Write-Host 'py.exe / python.exe не найден в PATH.' -ForegroundColor Red
    Write-Host 'Установите Python с опцией «Add to PATH» или просто откройте страницу с диска (ниже).' -ForegroundColor Yellow
    if (Test-Path -LiteralPath $indexFsPath) {
        Invoke-Item -LiteralPath $indexFsPath
    }
    pause
    exit 1
}

$pyArgs = New-Object System.Collections.ArrayList
if ($pyHost.PreferDash3) {
    [void]$pyArgs.Add('-3')
}
[void]$pyArgs.Add('-m')
[void]$pyArgs.Add('http.server')
[void]$pyArgs.Add('-b')
[void]$pyArgs.Add('127.0.0.1')
[void]$pyArgs.Add("$Port")

$joinedPy = ($pyArgs | ForEach-Object { Escape-CmdArg([string]$_) }) -join ' '
$dir = $PSScriptRoot.TrimEnd('\').Replace('"', '""')
$exe = $pyHost.Path.Trim().Replace('"', '""')

# Single-quoted here-string passes && and & to CMD only.
$url = ('http://127.0.0.1:{0}/' -f $Port)

function Open-InDefaultBrowser([string]$TargetUrl) {
    # Start-Process $url часто даёт другой результат, чем «start» из cmd — там надёжнее ассоциация браузера в Windows.
    Start-Process -FilePath 'cmd.exe' -ArgumentList @('/c', 'start', '', $TargetUrl) -WorkingDirectory $PSScriptRoot
}

if (Test-PortOpen -P $Port) {
    Write-Host ''
    Write-Host ('Порт ' + $Port + ' уже занят — сервер считается запущенным. Открываю браузер.') -ForegroundColor Cyan
    Open-InDefaultBrowser $url
    exit 0
}

$t = @'
cd /d "__DIR__" && "__EXE__" __ARGS__ || (echo. & echo ERR & pause)
'@
$inner = $t.Replace('__DIR__', $dir).Replace('__EXE__', $exe).Replace('__ARGS__', $joinedPy)

Start-Process -FilePath 'cmd.exe' -ArgumentList @('/k', $inner) -WorkingDirectory $PSScriptRoot

$listening = $false
for ($i = 0; $i -lt 80; $i++) {
    if (Test-PortOpen -P $Port) {
        $listening = $true
        break
    }
    Start-Sleep -Milliseconds 200
}

if (-not $listening) {
    Write-Host ''
    Write-Host ('Порт ' + $Port + ' пока не отвечает. Проверьте окно CMD с Python.') -ForegroundColor Yellow
    Write-Host ('Открываю страницу с диска: ' + $indexFsPath) -ForegroundColor Yellow
    if (Test-Path -LiteralPath $indexFsPath) {
        Invoke-Item -LiteralPath $indexFsPath
    }
    exit 0
}

Open-InDefaultBrowser $url
