import { beforeAll, describe, expect, it } from "vitest";
import { UserFactory } from "../../factory/user";
import { findAddressByUserId } from "@/lib/db";
import type { Address } from "@/types";

let user: UserFactory;

const setUpUser = async () => {
  return await UserFactory.create(`${crypto.randomUUID().split("-")[0]}@example.com`, { address: { value: {} } });
};

type AddressKeys = keyof Address;
const expectedKeys: AddressKeys[] = ["id", "user_id", "name", "country", "postal_code", "address"];

describe("addressesテーブルに関するテスト", () => {
  describe("findAddressByUserId", () => {
    beforeAll(async () => {
      user = await setUpUser();
    });

    it("指定したユーザーの住所レコードを取得できること", async () => {
      const result = await findAddressByUserId(user.id);
      expect(result).not.toBeNull();
      expect(result?.user_id).toBe(user.id);
      expect(result?.name).toBe(user.address?.name);
      expect(result?.country).toBe(user.address?.country);
      expect(result?.postal_code).toBe(user.address?.postal_code);
      expect(result?.address).toBe(user.address?.address);
      expect(Object.keys(result as Address)).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});
