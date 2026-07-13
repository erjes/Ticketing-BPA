<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewTicketCreated extends Notification
{
    use Queueable;

    protected $ticket;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
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
        $url = url("/admin/tickets/{$this->ticket->ticket_number}");
        $senderName = $this->ticket->user ? $this->ticket->user->name : 'Seseorang';

        return (new MailMessage)
            ->subject("Tiket Baru: {$this->ticket->ticket_number}")
            ->greeting("Halo {$notifiable->name},")
            ->line("Ada tiket baru yang dibuat oleh {$senderName} dengan nomor tiket #{$this->ticket->ticket_number} (\"{$this->ticket->subject}\").")
            ->line("Kategori: {$this->ticket->category}")
            ->action('Lihat Tiket', $url)
            ->line('Silakan segera ditinjau dan diklaim jika belum memiliki penanggung jawab.');
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
            'title' => "Tiket Baru Dibuat",
            'message' => ($this->ticket->user ? $this->ticket->user->name : 'Seseorang') . " membuat tiket baru #{$this->ticket->ticket_number}.",
            'type' => 'new_ticket',
        ];
    }
}
