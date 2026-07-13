<?php

namespace App\Notifications;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TicketStatusUpdated extends Notification
{
    use Queueable;

    protected $ticket;
    protected $oldStatus;
    protected $newStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket, $oldStatus, $newStatus)
    {
        $this->ticket = $ticket;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
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

        return (new MailMessage)
            ->subject("Status Tiket {$this->ticket->ticket_number} Diperbarui")
            ->greeting("Halo {$notifiable->name},")
            ->line("Status tiket Anda #{$this->ticket->ticket_number} dengan subjek \"{$this->ticket->subject}\" telah diperbarui.")
            ->line("Status sebelumnya: {$this->oldStatus}")
            ->line("Status terbaru: {$this->newStatus}")
            ->action('Lihat Tiket', $url)
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
            'title' => "Status Tiket Diperbarui",
            'message' => "Tiket #{$this->ticket->ticket_number} diubah statusnya menjadi {$this->newStatus}.",
            'type' => 'status_updated',
        ];
    }
}
