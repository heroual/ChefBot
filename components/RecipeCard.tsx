import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Recipe, HealthCondition, Macros } from '../types';
import { generateImage } from '../services/geminiService';

interface RecipeCardProps {
  recipe: Recipe;
}

const HealthTag: React.FC<{ tag: HealthCondition }> = ({ tag }) => {
    let icon = '';
    switch(tag) {
        case HealthCondition.Diabetes: icon = '🩸'; break;
        case HealthCondition.HighBloodPressure: icon = '🩺'; break;
        case HealthCondition.Cholesterol: icon = '🥑'; break;
        case HealthCondition.Anemia: icon = '🥬'; break;
        case HealthCondition.HeartIssues: icon = '❤️'; break;
    }
    return (
        <div className="flex items-center gap-1 text-xs bg-vibrant-blue/10 text-vibrant-blue rounded-full px-2 py-1">
            {icon}
            <span>{tag}</span>
        </div>
    );
};

const MacroInfo: React.FC<{ icon: string; value: number; unit: string; label: string; color: string }> = ({ icon, value, unit, label, color }) => (
    <div className="flex flex-col items-center text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${color}`}>
            {icon}
        </div>
        <p className="font-bold text-lg mt-1 text-white">{Math.round(value)} {unit}</p>
        <p className="text-xs text-white/60">{label}</p>
    </div>
);


const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    const fetchImage = async () => {
      setIsImageLoading(true);
      const fallbackUrl = `https://picsum.photos/seed/${recipe.recipeName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)}/800/600`;
      
      if (!recipe.imagePrompt) {
        setImageUrl(fallbackUrl);
        setIsImageLoading(false);
        return;
      }

      const base64Image = await generateImage(recipe.imagePrompt);
      if (base64Image) {
        setImageUrl(`data:image/png;base64,${base64Image}`);
      } else {
        setImageUrl(fallbackUrl);
      }
      setIsImageLoading(false);
    };

    fetchImage();
  }, [recipe]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 rounded-xl shadow-lg overflow-hidden max-w-4xl w-full mx-auto my-2 border border-vibrant-blue/20 transform hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="md:flex">
        <div className="md:w-5/12 md:flex-shrink-0">
          <div className="relative w-full h-56 md:h-full bg-black/20">
            {isImageLoading && (
              <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
                <svg className="w-10 h-10 text-white/30" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"/>
                </svg>
                <span className="sr-only">جاري تحميل الصورة...</span>
              </div>
            )}
            <img 
              src={imageUrl || ''} 
              alt={recipe.recipeName} 
              className={`w-full h-56 md:h-full object-cover transition-opacity duration-500 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
            />
          </div>
        </div>
        <div className="md:w-7/12 p-4 md:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-2">
              {recipe.healthTags && recipe.healthTags.map(tag => <HealthTag key={tag} tag={tag} />)}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-vibrant-orange mb-2">{recipe.recipeName}</h3>
          <p className="text-white/70 mb-4 text-sm">{recipe.description}</p>
          
          {recipe.macros && (
              <div className="mb-4 p-4 bg-black/20 rounded-lg">
                  <h4 className="font-semibold text-lg text-center text-white mb-3">القيم الغذائية التقريبية</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <MacroInfo icon="💪" value={recipe.macros.protein} unit="غ" label="بروتين" color="bg-vibrant-orange/10"/>
                      <MacroInfo icon="🍚" value={recipe.macros.carbs} unit="غ" label="كربوهيدرات" color="bg-vibrant-blue/10" />
                      <MacroInfo icon="🥑" value={recipe.macros.fats} unit="غ" label="دهون" color="bg-deep-purple/10" />
                      <MacroInfo icon="🔥" value={recipe.macros.calories} unit="kcal" label="سعرات" color="bg-yellow-500/10" />
                  </div>
              </div>
          )}

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg border-b-2 border-vibrant-orange/50 pb-1 mb-2 text-white">المكونات</h4>
              <ul className="list-disc list-inside space-y-1 text-white/80">
                {recipe.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg border-b-2 border-vibrant-orange/50 pb-1 mb-2 text-white">طريقة التحضير</h4>
              <ol className="list-decimal list-inside space-y-2 text-white/80">
                {recipe.preparationSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;