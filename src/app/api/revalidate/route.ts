import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Document type sent by the Sanity webhook -> cache tags to revalidate.
// Technologies are embedded in projects, so they refresh the project tag.
const TAGS_BY_TYPE: Record<string, string[]> = {
	project: ["project"],
	technology: ["project"],
	experience: ["experience"],
	siteSettings: ["siteSettings"],
};

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
	const type = body?._type;
	const tags =
		type && Object.hasOwn(TAGS_BY_TYPE, type) ? TAGS_BY_TYPE[type] : undefined;
	if (!tags) {
		return NextResponse.json({ revalidated: false }, { status: 200 });
	}

	for (const tag of tags) revalidateTag(tag, { expire: 0 });
	return NextResponse.json({ revalidated: true, tags });
}
