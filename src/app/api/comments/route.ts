import { NextRequest, NextResponse } from "next/server";
import { addComment } from "@/tools/DataManager";

export function POST(request: NextRequest) {
    return addComment(request);
}
