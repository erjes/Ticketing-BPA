<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$notifications = \Illuminate\Support\Facades\DB::table('notifications')->get();
foreach ($notifications as $n) {
    echo "ID: {$n->id}, Notifiable ID: {$n->notifiable_id}, Notifiable Type: {$n->notifiable_type}, Read At: {$n->read_at}\n";
    echo "Data: {$n->data}\n";
    echo "------------------------\n";
}
