import moment from 'moment'

export function mapToTriggerNotifications(notifications = []) {
    return notifications.map(notification => ({
        notification: {
            title: notification.notificationHeader,
            body: notification.notificationBody,
            notificationId: notification.notificationId,
            data: {
                shortId: notification.shortId,
                scheduledAt: notification.scheduledAt,
                scheduledAtString: notification.scheduledAtString,
                appletId: notification.appletId,
                activityId: notification.activityId,
                activityFlowId: notification.activityId,
                eventId: notification.eventId,
                isLocal: true,
                type: "schedule-event-alert",
            }
        },
        trigger: {
            fireDate: notification.scheduledAt,
        }
    }))
}

export function filterNotificationsByDate(notifications = [], date) {
    if (!date) throw Error('[filterNotificationsByDate] date is required');

    return notifications.filter(notification => {
        return notification.scheduledAt > date;
    })
}

export function splitArray(array, leftArraySize) {
    if (!leftArraySize) throw Error('[splitArray] leftArraySize is required');
    if (typeof leftArraySize !== 'number') throw Error('[splitArray] leftArraySize must be number');

    const rightArray = [...array];

    const leftArray = rightArray.splice(0, leftArraySize);

    return [leftArray, rightArray];
}

export const getMutex = () => {
  const mutex = {
    busy: false,
    setBusy: function() {
      this.busy = true;
    },
    release: function() {
      this.busy = false;
    },
    isBusy: function() {
      return this.busy;
    },
  };
  return mutex;
};