import { beforeAll, describe, expect, it } from "vitest";
import { UserFactory } from "../../../factory/user";
import { createAddress, findAddressByUserId, updateAddress } from "@/lib/db";
import type { Address } from "@/types";

let user: UserFactory;

const setUpUser = async (withAddress: boolean) => {
  const email = `${crypto.randomUUID().split("-")[0]}@example.com`;
  return await UserFactory.create(email, withAddress ? { address: { value: {} } } : undefined);
};

type AddressKeys = keyof Address;
const expectedKeys: AddressKeys[] = ["id", "user_id", "name", "country", "postal_code", "address"];

describe("addressesテーブルに関するテスト", () => {
  describe("findAddressByUserId", () => {
    beforeAll(async () => {
      user = await setUpUser(true);
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

  describe("createAddress", () => {
    beforeAll(async () => {
      user = await setUpUser(false);
    });

    it("住所レコードを作成できること", async () => {
      const result = await createAddress({
        name: "名前",
        country: "国名",
        postal_code: "123-4567",
        address: "住所",
        user_id: user.id,
      });
      expect(result.id).not.toBeNull();
      expect(result.user_id).toBe(user.id);
      expect(result.name).toBe("名前");
      expect(result.country).toBe("国名");
      expect(result.postal_code).toBe("123-4567");
      expect(result.address).toBe("住所");
      expect(Object.keys(result)).toEqual(expect.arrayContaining(expectedKeys));
    });
  });

  describe("updateAddress", () => {
    beforeAll(async () => {
      user = await setUpUser(true);
    });

    it("住所レコードを更新できること", async () => {
      const updatedResult = await updateAddress({
        name: "新しい名前",
        country: "新しい国名",
        postal_code: "765-4321",
        address: "新しい住所",
        user_id: user.id,
        id: user.address?.id as number,
      });
      expect(updatedResult.user_id).toBe(user.id);
      expect(updatedResult.name).toBe("新しい名前");
      expect(updatedResult.country).toBe("新しい国名");
      expect(updatedResult.postal_code).toBe("765-4321");
      expect(updatedResult.address).toBe("新しい住所");
      expect(Object.keys(updatedResult)).toEqual(expect.arrayContaining(expectedKeys));
    });
  });
});
