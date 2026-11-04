$root = 'd:\workspace\Projects\Rental system'
$node = 'd:\workspace\Projects\Rental system\node-portable\node-v24.19.0-win-x64\node.exe'
$serverDir = 'd:\workspace\Projects\Rental system\server'
$clientDir = 'd:\workspace\Projects\Rental system\client'
$serverEntry = 'd:\workspace\Projects\Rental system\server\dist\index.js'
$viteEntry = 'd:\workspace\Projects\Rental system\client\node_modules\vite\bin\vite.js'
$serverOut = 'd:\workspace\Projects\Rental system\server-local.log'
$serverErr = 'd:\workspace\Projects\Rental system\server-local.err.log'
$clientOut = 'd:\workspace\Projects\Rental system\client-local.log'
$clientErr = 'd:\workspace\Projects\Rental system\client-local.err.log'

Start-Process -FilePath $node -ArgumentList @($serverEntry) -WorkingDirectory $serverDir -WindowStyle Hidden -RedirectStandardOutput $serverOut -RedirectStandardError $serverErr | Out-Null
Start-Process -FilePath $node -ArgumentList @($viteEntry, '--host', '127.0.0.1', '--port', '4200') -WorkingDirectory $clientDir -WindowStyle Hidden -RedirectStandardOutput $clientOut -RedirectStandardError $clientErr | Out-Null

Write-Host 'Started backend and frontend processes.'
