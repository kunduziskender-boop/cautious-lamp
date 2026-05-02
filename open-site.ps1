# Opens local photographer portfolio via Python http.server.

$ErrorActionPreference = 'Stop'

Set-Location -LiteralPath $PSScriptRoot
$Port = 9333

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
    Write-Host 'py.exe / python.exe not found in PATH.' -ForegroundColor Red
    Write-Host 'Install Python and check ''Add Python to PATH'', or open index.html with double-click.'
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
    Write-Host ('Port ' + $Port + ' not ready yet. Read the CMD window with the server.') -ForegroundColor Yellow
}

$url = ('http://127.0.0.1:{0}/' -f $Port)
Start-Process $url
