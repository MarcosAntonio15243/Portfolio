import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

const TAGS = new Set(["project", "experience", "siteSettings"]);

export async function POST(req: NextRequest) {
	const secret = process.env.SANITY_REVALIDATE_SECRET;
	if (!secret) {
		return new NextResponse("Missing revalidate secret", { status: 500 });
	}

	const { isValidSignature, body } = await parseBody<{ _type?: string }>(
		req,
		secret,
	);
	if (!isValidSignature) {
		return new NextResponse("Invalid signature", { status: 401 });
	}
	if (!body?._type || !TAGS.has(body._type)) {
		return NextResponse.json({ revalidated: false }, { status: 200 });
	}

	revalidateTag(body._type);
	return NextResponse.json({ revalidated: true, tag: body._type });
}
