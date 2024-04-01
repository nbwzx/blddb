"use server";

import { cookies } from "next/headers";

export async function switchLocaleAction(value: string) {
  cookies().set("i18next", value);

  // It does not matter what we return here
  return {
    status: "success",
  };
}
