import { NextRequest } from "next/server";
import { getUserProfile} from "@/tools/DataManager";

interface Params {
    params: {
        id: string;
    };
}

// VULNERABILITY 2: Horizontal Privilege Escalation
// This endpoint doesn't verify that the requesting user is accessing their own profile
export async function GET(request: NextRequest, { params }: Params) {
    return getUserProfile(request, params.id);
}