import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, Sender, Cuisine, Recipe, Mood, HealthCondition, FitnessGoal, FitnessProfile } from '../types';
import { getAiResponse } from '../services/geminiService';
import RecipeCard from './RecipeCard';

const FitnessGoalSelector: React.FC<{ selected: FitnessGoal | 'none', onSelect: (goal: FitnessGoal | 'none') => void }> = ({ selected, onSelect }) => {
    const goals = [
        { goal: FitnessGoal.BuildMuscle, icon: '💪' },
        { goal: FitnessGoal.LoseWeight, icon: '⚖️' },
        { goal: FitnessGoal.MaintainWeight, icon: '🍽️' },
    ];
    return (
        <div className="mb-4 p-3 bg-vibrant-blue/5 rounded-lg border border-vibrant-blue/10">
            <p className="text-center text-sm text-white/60 mb-2">شنو هو الهدف الرياضي ديالك؟</p>
            <div className="flex justify-center gap-2 flex-wrap">
                {goals.map(({ goal, icon }) => (
                    <button
                        key={goal}
                        onClick={() => onSelect(selected === goal ? 'none' : goal)}
                        className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 ${
                            selected === goal 
                            ? 'bg-vibrant-blue text-black shadow-lg scale-105 animate-glow-pulse' 
                            : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                        }`}
                    >
                        <span>{icon}</span>
                        {goal}
                    </button>
                ))}
            </div>
        </div>
    );
};

const FitnessProfileForm: React.FC<{ profile: FitnessProfile, onChange: (profile: FitnessProfile) => void }> = ({ profile, onChange }) => {
    const inputStyle = "p-2 border border-white/20 rounded-md bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-vibrant-blue w-full";
    return (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-black/20 rounded-lg overflow-hidden"
        >
            <p className="text-center text-sm font-semibold text-white/80 mb-3">عطيني معلومات عليك باش نحسب ليك داكشي هو هاداك:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <select value={profile.gender} onChange={e => onChange({ ...profile, gender: e.target.value as FitnessProfile['gender'] })} className={inputStyle}>
                    <option value="any" disabled>الجنس</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                </select>
                <input type="number" placeholder="الوزن (kg)" value={profile.weight || ''} onChange={e => onChange({ ...profile, weight: parseInt(e.target.value) || 0 })} className={inputStyle} />
                <input type="number" placeholder="الطول (cm)" value={profile.height || ''} onChange={e => onChange({ ...profile, height: parseInt(e.target.value) || 0 })} className={inputStyle} />
                <select value={profile.activityLevel} onChange={e => onChange({ ...profile, activityLevel: e.target.value as FitnessProfile['activityLevel'] })} className={inputStyle}>
                     <option value="any" disabled>النشاط</option>
                    <option value="low">منخفض</option>
                    <option value="medium">متوسط</option>
                    <option value="high">عالي</option>
                </select>
            </div>
        </motion.div>
    );
};

const MoodSelector: React.FC<{ selected: Mood | 'any', onSelect: (mood: Mood | 'any') => void }> = ({ selected, onSelect }) => {
    const moods = [
        { mood: Mood.Happy, icon: '😊' },
        { mood: Mood.Lazy, icon: '😴' },
        { mood: Mood.Stressed, icon: '😫' },
        { mood: Mood.Healthy, icon: '🥗' },
        { mood: Mood.Celebratory, icon: '🎉' },
    ];
    return (
        <div className="mb-4">
            <p className="text-center text-sm text-white/60 mb-2">كيف حاس براسك اليوم؟</p>
            <div className="flex justify-center gap-2 flex-wrap">
                {moods.map(({ mood, icon }) => (
                    <button
                        key={mood}
                        onClick={() => onSelect(mood)}
                        className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 ${
                            selected === mood 
                            ? 'bg-vibrant-orange text-black shadow-lg scale-105' 
                            : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                        }`}
                    >
                        <span>{icon}</span>
                        {mood}
                    </button>
                ))}
            </div>
        </div>
    );
};

const HealthConditionSelector: React.FC<{ selected: HealthCondition[], onSelect: (condition: HealthCondition) => void }> = ({ selected, onSelect }) => {
    const conditions = [
        { condition: HealthCondition.Diabetes, icon: '🩸' },
        { condition: HealthCondition.HighBloodPressure, icon: '🩺' },
        { condition: HealthCondition.Cholesterol, icon: '🥑' },
        { condition: HealthCondition.Anemia, icon: '🥬' },
        { condition: HealthCondition.HeartIssues, icon: '❤️' },
    ];

    return (
        <div className="mb-4 p-3 bg-deep-purple/5 rounded-lg border border-deep-purple/10">
             <p className="text-center text-sm text-white/60 mb-2">واش عندك شي حالة صحية؟ (اختياري)</p>
            <div className="flex justify-center gap-2 flex-wrap">
                {conditions.map(({ condition, icon }) => {
                    const isSelected = selected.includes(condition);
                    return (
                        <button
                            key={condition}
                            onClick={() => onSelect(condition)}
                             className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-1 ${
                                isSelected 
                                ? 'bg-deep-purple text-white shadow-lg scale-105' 
                                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                            }`}
                        >
                            <span>{icon}</span>
                            {condition}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const CuisineFilter: React.FC<{ selected: Cuisine | 'any', onSelect: (cuisine: Cuisine | 'any') => void }> = ({ selected, onSelect }) => {
    const cuisines = Object.values(Cuisine);
    return (
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
            {cuisines.map(cuisine => (
                <button
                    key={cuisine}
                    onClick={() => onSelect(cuisine)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                        selected === cuisine 
                        ? 'bg-vibrant-orange text-black shadow-md' 
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                    }`}
                >
                    {cuisine}
                </button>
            ))}
        </div>
    );
};

const ChatInterface: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'initial-1', sender: Sender.AI, content: "السلام! أنا الشاف ديالك. ختار هدفك الرياضي أو مزاجك اليوم وقول ليا باش نقدر نعاونك؟" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | 'any'>('any');
    const [selectedMood, setSelectedMood] = useState<Mood | 'any'>('any');
    const [selectedHealthConditions, setSelectedHealthConditions] = useState<HealthCondition[]>([]);
    const [selectedFitnessGoal, setSelectedFitnessGoal] = useState<FitnessGoal | 'none'>('none');
    const [fitnessProfile, setFitnessProfile] = useState<FitnessProfile>({ gender: 'any', weight: 0, height: 0, activityLevel: 'any' });

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleHealthConditionSelect = (condition: HealthCondition) => {
        setSelectedHealthConditions(prev => 
            prev.includes(condition) 
            ? prev.filter(c => c !== condition) 
            : [...prev, condition]
        );
    };
    
    const handleSend = async (prompt: string) => {
        if (!prompt.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { id: Date.now().toString(), sender: Sender.User, content: prompt };
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);
        setInput('');

        const aiResponse = await getAiResponse(prompt, selectedCuisine, selectedMood, selectedHealthConditions, selectedFitnessGoal, fitnessProfile);

        if (!aiResponse.recipe && !aiResponse.chat?.message) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: Sender.AI,
                content: "عفوًا، حدث خطأ ما. الشاف مشغول شوية، حاول مرة أخرى!",
            };
            setMessages(prev => [...prev, errorMessage]);
            setIsLoading(false);
            return;
        }

        const newAiMessage: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            sender: Sender.AI, 
            content: aiResponse.chat?.message || '',
            recipe: aiResponse.recipe,
            healthTips: aiResponse.healthTips,
        };
        setMessages(prev => [...prev, newAiMessage]);
        setIsLoading(false);
    };

    const handleRandom = () => {
        const randomPrompts = [
            "عطيني شي وصفة عشوائية للعشاء",
            "أنا حاير، اقترح علي شي حاجة خفيفة",
            "بغيت شي حاجة حلوة وساهلة",
            "شنو نطيب اليوم؟ فاجئني"
        ];
        const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
        handleSend(randomPrompt);
    };

    return (
        <div className="flex flex-col flex-grow w-full max-w-7xl mx-auto p-2 sm:p-4">
            <FitnessGoalSelector selected={selectedFitnessGoal} onSelect={setSelectedFitnessGoal} />
            <AnimatePresence>
                {selectedFitnessGoal !== 'none' && <FitnessProfileForm profile={fitnessProfile} onChange={setFitnessProfile} />}
            </AnimatePresence>
            <MoodSelector selected={selectedMood} onSelect={setSelectedMood} />
            <HealthConditionSelector selected={selectedHealthConditions} onSelect={handleHealthConditionSelect} />
            <CuisineFilter selected={selectedCuisine} onSelect={setSelectedCuisine} />
            
            <div className="flex-grow overflow-y-auto mb-4 p-2 sm:p-4 space-y-4 rounded-lg bg-black/20">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2"
                        >
                           {msg.content && (
                             <div className={`flex ${msg.sender === Sender.User ? 'justify-end' : 'justify-start'}`}>
                                 <div
                                     className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-2xl px-4 py-3 shadow ${
                                         msg.sender === Sender.User
                                             ? 'bg-vibrant-orange text-black rounded-br-none'
                                             : 'bg-background-dark text-white/90 rounded-bl-none border border-vibrant-blue/40'
                                     }`}
                                 >
                                     {typeof msg.content === 'string' ? <p className="whitespace-pre-wrap">{msg.content}</p> : msg.content}
                                 </div>
                             </div>
                           )}

                           {msg.sender === Sender.AI && msg.recipe && (
                                <RecipeCard recipe={msg.recipe} />
                           )}

                            {msg.sender === Sender.AI && msg.healthTips && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                    className="flex justify-center py-2"
                                >
                                    <div className="w-full max-w-2xl p-4 rounded-xl bg-deep-purple/10 border-t-2 border-b-2 border-deep-purple/30">
                                        <h4 className="font-bold text-lg text-white mb-3 flex items-center justify-center gap-2">
                                            <span className="text-2xl">💡</span>
                                            <span>نصيحة الشاف</span>
                                        </h4>
                                        <ul className="list-disc list-inside space-y-1 text-white/80 text-sm md:text-base">
                                            {msg.healthTips.map((tip, index) => <li key={index}>{tip}</li>)}
                                        </ul>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                        <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-3 shadow bg-white/5 rounded-bl-none">
                            <div className="flex items-center space-x-2 space-x-reverse">
                                <span className="text-white/60">الشاف كايفكر...</span>
                                <div className="w-2 h-2 bg-vibrant-blue rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-vibrant-blue rounded-full animate-pulse delay-150"></div>
                                <div className="w-2 h-2 bg-vibrant-blue rounded-full animate-pulse delay-300"></div>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="mt-auto bg-background-dark/80 backdrop-blur-sm p-2 sm:p-4 rounded-lg shadow-lg border-t border-white/10">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="قول ليا شنو فخاطرك..."
                        className="flex-grow p-3 border-2 border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-vibrant-blue bg-white/5 text-white placeholder-white/40"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading} className="bg-vibrant-blue text-black p-3 rounded-full hover:bg-vibrant-blue/80 disabled:bg-vibrant-blue/50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                    <button type="button" onClick={handleRandom} disabled={isLoading} className="bg-deep-purple text-white p-3 rounded-full hover:bg-deep-purple/80 disabled:bg-deep-purple/50 transition-colors" title="وصفة عشوائية">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;