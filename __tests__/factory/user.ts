import { createUser } from "@/lib/db";

export class UserFactory {
  id: number;
  email: string;

  constructor(email: string) {
    this.id = 0;
    this.email = email;
  }

  public static async create(email?: string): Promise<UserFactory> {
    const factory = new UserFactory(email || `${crypto.randomUUID().split("-")[0]}@example.com`);
    const user = await createUser(factory.email);
    factory.id = user?.id || 0;
    return factory;
  }
}
