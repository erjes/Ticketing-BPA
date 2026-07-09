<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['ticket_number', 'user_id', 'category', 'subject', 'description', 'status', 'admin_id'])]
class Ticket extends Model
{
    protected $fillable = [
        'ticket_number',
        'user_id',
        'category',
        'subject',
        'description',
        'status',
        'admin_id',
    ];

    public function attachments(): HasMany
    {
        return $this->hasMany(TicketAttachment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(TicketReply::class);
    }
}
