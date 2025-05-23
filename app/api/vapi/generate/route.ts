import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, level, techstacks, amount, userid } = await request.json();

  console.log("Request Body:", { type, role, level, techstacks, amount, userid });

  // Validate input
  if (!type || !role || !level || !techstacks || !amount || !userid) {
    return Response.json(
      { success: false, error: "Missing required fields in the request body" },
      { status: 400 }
    );
  }

  // Normalize and convert techstacks to an array of languages
  const techstackArray = techstacks
    ? techstacks
      .replace(/,/g, " ") // Replace commas with spaces
      .toLowerCase() // Convert to lowercase for consistent filtering
      .split(" ") // Split into words
      .filter((word: string) => word && !["and", "the"].includes(word)) // Remove unwanted words
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    : [];


  try {
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstackArray.join(", ")}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstackArray,
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const resFirebase = await db.collection("interviews").add(interview);
    console.log('resFirebase', resFirebase);

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
