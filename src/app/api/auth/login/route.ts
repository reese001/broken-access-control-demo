import { NextRequest } from "next/server";
import { loginUser } from "@/tools/DataManager";

export async function POST(request: NextRequest) {
    return loginUser(request);
} 