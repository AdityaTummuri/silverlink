import { SeniorEvent, SeniorEventListener } from '../../types/events';

class EventService {
  private eventsLog: SeniorEvent[] = [];
  private listeners: Set<SeniorEventListener> = new Set();

  /**
   * Emit a new senior-side event.
   * Logs it locally and notifies all active listeners (e.g. SilverPulse engine, Person 2 Firebase sync).
   */
  public emit(event: SeniorEvent): SeniorEvent {
    this.eventsLog.unshift(event);
    console.log(`[EventService] EMITTED ${event.eventType}:`, event);

    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (err) {
        console.error('[EventService] Error in listener callback:', err);
      }
    });

    return event;
  }

  /**
   * Subscribe to senior-side events.
   */
  public subscribe(listener: SeniorEventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get all logged events for a given senior ID.
   */
  public getEvents(seniorId?: string): SeniorEvent[] {
    if (!seniorId) return this.eventsLog;
    return this.eventsLog.filter((e) => e.seniorId === seniorId);
  }

  /**
   * Clear in-memory event history (useful for testing).
   */
  public clear(): void {
    this.eventsLog = [];
  }
}

export const seniorEventService = new EventService();
