# Tiny static server for local preview — no dependencies, Windows PowerShell.
# Usage:  powershell -ExecutionPolicy Bypass -File .\serve.ps1
# Then open http://127.0.0.1:5173

param([int]$Port = 5173)

$root = $PSScriptRoot

$mime = @{
  '.html' = 'text/html; charset=utf-8'
  '.css'  = 'text/css; charset=utf-8'
  '.js'   = 'application/javascript; charset=utf-8'
  '.json' = 'application/json; charset=utf-8'
  '.svg'  = 'image/svg+xml'
  '.jpg'  = 'image/jpeg'
  '.jpeg' = 'image/jpeg'
  '.png'  = 'image/png'
  '.webp' = 'image/webp'
  '.ico'  = 'image/x-icon'
  '.woff2'= 'font/woff2'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Start()
Write-Host "Mayian site: http://127.0.0.1:$Port/  (Ctrl+C to stop)"

while ($listener.IsListening) {
  try {
    $ctx  = $listener.GetContext()
    $path = [uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    if ([string]::IsNullOrEmpty($path) -or $path -eq '/') { $path = '/index.html' }
    $file = Join-Path $root ($path.TrimStart('/') -replace '/', '\')

    if (Test-Path -LiteralPath $file -PathType Leaf) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext   = [System.IO.Path]::GetExtension($file).ToLower()
      $ctx.Response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.Headers['Cache-Control'] = 'no-cache'
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
    }
    $ctx.Response.OutputStream.Close()
  } catch {
    # client disconnected — keep serving
  }
}
