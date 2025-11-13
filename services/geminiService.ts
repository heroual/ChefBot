import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Cuisine, AiResponse, Mood, HealthCondition, FitnessGoal, FitnessProfile } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder for development. In a real environment, the key is expected to be set.
  // The UI should handle this gracefully if the key is missing.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
  process.env.API_KEY = "YOUR_API_KEY_HERE";
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
أنت شيف مغربي مرح ومضحك اسمك "الشاف بوط". هدفك هو مساعدة المستخدمين على تحديد ما يأكلونه.
تحدث بالدارجة المغربية. كن ودودًا، واستخدم الفكهاة والأقوال المغربية.

**وضعية اللياقة البدنية (Fitness Mode):**
إذا قدم المستخدم هدفًا للياقة البدنية (بناء العضلات، تخسيس الوزن، الحفاظ على الوزن) وبياناته الشخصية (الجنس، الوزن، الطول، مستوى النشاط)، تحول إلى مدرب تغذية رياضي.
1.  قم بحساب احتياجاتهم اليومية من السعرات الحرارية والماكروز (بروتين، كربوهيدرات، دهون) بناءً على هدفهم وبياناتهم.
2.  اقترح وصفة تتناسب تمامًا مع هذه الاحتياجات.
3.  يجب أن يحتوي كائن 'recipe' على كائن 'macros' معبأ بالقيم المحسوبة للوصفة المقترحة.
    - بناء العضلات: ركز على البروتين العالي. "باش تبني دوك العضلات، خاصك بروتين مزيان! هاك هاد الوصفة عامرة بيه!".
    - تخسيس الوزن: ركز على السعرات الحرارية المنخفضة والألياف. "بغيتي تنقص الوزن؟ هاد الأكلة خفيفة ظريفة وغادي تشبعك بلا ما تحس بالذنب.".
    - الحفاظ على الوزن: اقترح وجبات متوازنة. "باش تبقى فالفورمة، خاصك ماكلة متوازنة. هاد الطبق فيه من كلشي شوية.".

**الوضعية العادية:**
إذا لم يتم تحديد هدف لياقة، اتبع السلوك العادي بناءً على المزاج والحالة الصحية.
- فرحان: اقترح شي حاجة مبهجة.
- كسلان: اقترح وصفة سريعة وسهلة.
- متوتر: اقترح شي حاجة مريحة.
- صحي: ركز على المكونات الصحية.
- احتفالي: اقترح طبق خاص.

تكيف مع الحالات الصحية:
- داء السكري: وصفات قليلة السكر.
- ارتفاع الضغط: تجنب الملح.
- الكوليسترول: وصفات قليلة الدهون.
- فقر الدم: ركز على الحديد.
- مشاكل القلب: وصفات صحية للقلب.

يجب أن ترد دائماً بصيغة JSON فقط، بدون أي نص قبله أو بعده.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        recipe: {
            type: Type.OBJECT,
            description: "يظهر هذا الكائن فقط إذا كان الرد وصفة.",
            properties: {
                recipeName: { type: Type.STRING, description: "اسم الوصفة" },
                description: { type: Type.STRING, description: "وصف قصير وجذاب للطبق" },
                cuisine: { type: Type.STRING, description: "نوع المطبخ (مغربي, متوسطي, عالمي)" },
                ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "قائمة المكونات" },
                preparationSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "خطوات التحضير" },
                imagePrompt: { type: Type.STRING, description: "وصف لتوليد صورة للطبق. يجب أن يكون وصفاً غنياً ومفصلاً باللغة الإنجليزية." },
                healthTags: { type: Type.ARRAY, items: { type: Type.STRING, enum: Object.values(HealthCondition) }, description: "قائمة بالحالات الصحية المناسبة لهذه الوصفة" },
                macros: {
                    type: Type.OBJECT,
                    description: "يظهر هذا الكائن فقط للوصفات المتعلقة باللياقة البدنية",
                    properties: {
                        protein: { type: Type.NUMBER, description: "البروتين بالجرام" },
                        carbs: { type: Type.NUMBER, description: "الكربوهيدرات بالجرام" },
                        fats: { type: Type.NUMBER, description: "الدهون بالجرام" },
                        calories: { type: Type.NUMBER, description: "السعرات الحرارية" }
                    }
                }
            }
        },
        chat: {
            type: Type.OBJECT,
            description: "يظهر هذا الكائن فقط إذا كان الرد رسالة دردشة.",
            properties: {
                message: { type: Type.STRING, description: "محتوى رسالة الدردشة الودية" }
            }
        },
        healthTips: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "نصائح صحية قصيرة ومفيدة بالدارجة المغربية. يمكن أن تظهر مع أي رد."
        }
    }
};


export const getAiResponse = async (
  prompt: string,
  cuisine: Cuisine | 'any',
  mood: Mood | 'any',
  healthConditions: HealthCondition[],
  fitnessGoal: FitnessGoal | 'none',
  fitnessProfile: FitnessProfile
): Promise<AiResponse> => {
  try {
    let fitnessPrompt = '';
    if (fitnessGoal !== 'none' && fitnessProfile.weight > 0 && fitnessProfile.height > 0) {
        fitnessPrompt = `
        الهدف الرياضي: ${fitnessGoal}
        الجنس: ${fitnessProfile.gender === 'male' ? 'ذكر' : 'أنثى'}
        الوزن: ${fitnessProfile.weight} كغ
        الطول: ${fitnessProfile.height} سم
        مستوى النشاط: ${fitnessProfile.activityLevel === 'low' ? 'منخفض' : fitnessProfile.activityLevel === 'medium' ? 'متوسط' : 'عالي'}
        `;
    }
      
    const fullPrompt = `
    المستخدم يقول: "${prompt}"
    المطبخ المفضل: ${cuisine === 'any' ? 'أي نوع' : cuisine}
    مزاج المستخدم: ${mood === 'any' ? 'غير محدد' : mood}
    الحالة الصحية: ${healthConditions.length === 0 ? 'لا يوجد' : healthConditions.join(', ')}
    ${fitnessPrompt}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText) as AiResponse;
    return parsedResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (process.env.API_KEY === "YOUR_API_KEY_HERE") {
        return {
            chat: { message: "عفوًا، يبدو أن مفتاح API غير مهيأ. يرجى التأكد من إعداده بشكل صحيح للمتابعة. أنا هنا للمساعدة بمجرد أن يكون كل شيء جاهزًا!" }
        };
    }
    return {
      chat: { message: "عفوًا، حدث خطأ ما. ربما الشبكة فيها مشكل أو الشواية تحرقات. حاول مرة أخرى!" }
    };
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const imageGenerationPrompt = `A cinematic, professional food photography shot of ${prompt}. The lighting is bright and natural, and the dish is presented beautifully on a rustic plate. Moroccan zellige patterns are visible in the background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: imageGenerationPrompt }],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    return null;
  }
};