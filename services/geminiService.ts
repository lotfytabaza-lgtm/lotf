
import { GoogleGenAI } from "@google/genai";
import { Transaction, Supplier } from "../types";

export const getFinancialInsights = async (transactions: Transaction[], suppliers: Supplier[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const dataSummary = {
    totalTransactions: transactions.length,
    totalVolume: transactions.reduce((acc, t) => acc + t.amount, 0),
    totalCommission: transactions.reduce((acc, t) => acc + t.commission, 0),
    lowBalances: suppliers.filter(s => s.currentBalance < s.threshold).map(s => s.provider),
    topProviders: Array.from(new Set(transactions.map(t => t.provider)))
  };

  const prompt = `بصفتك خبير محاسبي مالي لموزع دفع إلكتروني في مصر، حلل البيانات التالية وقدم تقريراً مختصراً باللغة العربية:
  عدد العمليات: ${dataSummary.totalTransactions}
  إجمالي حجم التداول: ${dataSummary.totalVolume} جنيه
  إجمالي الأرباح (العمولات): ${dataSummary.totalCommission} جنيه
  شركات رصيدها منخفض: ${dataSummary.lowBalances.join(', ')}
  الشركات الأكثر نشاطاً: ${dataSummary.topProviders.join(', ')}
  
  المطلوب: تقديم 3 نصائح لتحسين الربحية وتنبيه بخصوص الأرصدة المنخفضة بشكل احترافي ومختصر جداً.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، تعذر تحليل البيانات حالياً. يرجى التحقق من اتصالك بالإنترنت.";
  }
};
