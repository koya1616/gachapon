import type { Address } from "@/types";
import { executeQuery } from "..";

export const findAddressByUserId = async (user_id: number): Promise<Address | null> => {
  const query = `
    SELECT * FROM addresses WHERE user_id = $1
  `;
  const params = [user_id];
  const addresses = await executeQuery<Address>(query, params);
  return addresses.length > 0 ? addresses[0] : null;
};

export const createAddress = async (address: Omit<Address, "id">): Promise<Address> => {
  const query = `
    INSERT INTO addresses (user_id, name, country, postal_code, address)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const params = [address.user_id, address.name, address.country, address.postal_code, address.address];
  const result = await executeQuery<Address>(query, params);
  return result[0];
};

export const updateAddress = async (address: Address): Promise<Address> => {
  const query = `
    UPDATE addresses
    SET name = $1, country = $2, postal_code = $3, address = $4
    WHERE id = $5
    RETURNING *
  `;
  const params = [address.name, address.country, address.postal_code, address.address, address.id];
  const result = await executeQuery<Address>(query, params);
  return result[0];
};
