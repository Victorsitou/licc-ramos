interface NotificationResponse {
  data: FeatureData[];
}

interface Feature {
  emoji: string;
  title: string;
  description: string;
}

export interface FeatureData {
  id: string;
  date: string;
  features: Feature[];
  footer?: string;
}

export default class Notifications {
  constructor() {}

  public latestNotification() {
    return window.localStorage.getItem("latestNotification");
  }

  public setLatestNotification(notificationId: string) {
    window.localStorage.setItem("latestNotification", notificationId);
  }

  public async unseenNotification(): Promise<{
    unseen: boolean;
    latest: string | null;
    content: FeatureData;
  }> {
    const latest = this.latestNotification();
    const response: NotificationResponse = await fetch(
      "/api/notifications",
    ).then((res) => res.json());
    if (!response.data.length)
      return {
        unseen: false,
        latest: null,
        content: { id: "0", date: "", features: [] },
      };

    return {
      unseen: latest !== response.data[response.data.length - 1].id,
      latest: response.data[response.data.length - 1].id.toString(),
      content: response.data[response.data.length - 1],
    };
  }
}
