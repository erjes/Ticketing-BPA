<?php

namespace App\Notifications;

use App\Models\Ticket;
use App\Models\TicketReply;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewTicketReply extends Notification
{
    use Queueable;

    protected $ticket;
    protected $reply;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket, TicketReply $reply)
    {
        $this->ticket = $ticket;
        $this->reply = $reply;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = url("/tickets/{$this->ticket->ticket_number}");
        if ($notifiable->role === 'admin' || $notifiable->role === 'super_admin') {
            $url = url("/admin/tickets/{$this->ticket->ticket_number}");
        }

        $senderName = $this->reply->user ? $this->reply->user->name : 'Seseorang';

        return (new MailMessage)
            ->subject("Tanggapan Baru untuk Tiket {$this->ticket->ticket_number}")
            ->greeting("Halo {$notifiable->name},")
            ->line("Ada tanggapan baru dari {$senderName} pada tiket #{$this->ticket->ticket_number} (\"{$this->ticket->subject}\").")
            ->line("\"{$this->reply->message}\"")
            ->action('Lihat Tanggapan', $url)
            ->line('Terima kasih telah menggunakan sistem kami.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'ticket_id' => $this->ticket->id,
            'ticket_number' => $this->ticket->ticket_number,
            'title' => "Balasan Tiket Baru",
            'message' => ($this->reply->user ? $this->reply->user->name : 'Seseorang') . " membalas tiket #{$this->ticket->ticket_number}.",
            'type' => 'new_reply',
        ];
    }
}
