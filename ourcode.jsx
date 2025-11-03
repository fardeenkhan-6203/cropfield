import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Thermometer, Droplets, Wind, AlertTriangle, CheckCircle, Leaf, TrendingUp, FileText } from 'lucide-react';

// --- DATASET: DISEASES (backend data, abhi yahi use hoga) ---
// Note: 'disease5' key fix kiya gaya hai, jo original data mein duplicate ho raha tha.
const DISEASE_INFO = {
    "disease1": {
        "crop": "Wheat (गेहूँ)",
        "disease_name": "Stripe Rust (धारीदार रस्ट)",
        "severity": "Very High (बहुत अधिक)",
        "symptoms": ["Patton par peeli dhaariyan", "Pustules ka tootna"],
        "treatment": ["Systemic fungicide (Propiconazole)", "Jaldi pata lagana aur spray karna"],
    },
    "disease2": {
        "crop": "Maize (मक्का)",
        "disease_name": "Fall Armyworm (कीड़ा)",
        "severity": "Very High (बहुत अधिक)",
        "symptoms": ["Patton mein bade chhed", "Ghoomti hui whorls chabayi hui", "Larva aur frass ki maujudgi"],
        "treatment": ["Bt insecticide", "Whorl mein daanedar insecticide"],
    },
    "disease3": {
        "crop": "Potato (आलू)",
        "disease_name": "Late Blight (देर से झुलसना)",
        "severity": "Very High (बहुत अधिक)",
        "symptoms": ["Tezi se badhne waale gehre dhabbe", "Patton ke kinaron par safed fungal growth"],
        "treatment": ["Mancozeb fungicide", "Systemic fungicides"],
    },
    "disease4": {
        "crop": "Tomato (टमाटर)",
        "disease_name": "Leaf Curl Virus (पत्ती कर्ल वायरस)",
        "severity": "High (उच्च)",
        "symptoms": ["Patton ka upar ki taraf ghumna", "Ruka hua growth", "Nas (vein) ka mota hona"],
        "treatment": ["Sankramit paudhon ko hata dein", "Whitefly control ke liye insecticide"],
    },
    "disease5": { // Original data mein yeh 'disease6' tha aur duplicate ho gaya tha.
        "crop": "Sugarcane (गन्ना)",
        "disease_name": "Red Rot (लाल सड़न)",
        "severity": "High (उच्च)",
        "symptoms": ["Ganne kholne par safed dhabbon ke saath laal interior", "Khatti badboo"],
        "treatment": ["Koi chemical ilaaj nahin", "Sankramit jhund ko ukhaad kar nasht kar dein"],
    },
    "disease6": {
        "crop": "Cotton (कपास)",
        "disease_name": "Bacterial Blight (जीवाणु झुलसा)",
        "severity": "Medium (मध्यम)",
        "symptoms": ["Koniye (angular) patte ke dhabbe", "Tana par kaale ghav (black arm)"],
        "treatment": ["Copper spray", "Antibiotics (Streptocycline)"],
    },
    "disease7": {
        "crop": "Cashew (काजू)",
        "disease_name": "Anthracnose (एन्थ्रेक्नोज)",
        "severity": "High (उच्च)",
        "symptoms": ["Tazeh shoots aur phalon par gehre bhoore dhabbe", "Phoolon ka jhulsa (blossom blight)"],
        "treatment": ["Copper-based fungicide", "Sankramit hisson ko kaat dein"],
    },
    "disease8": {
        "crop": "Banana (केला)",
        "disease_name": "Panama Disease (Wilt) (पनामा रोग)",
        "severity": "Very High (बहुत अधिक)",
        "symptoms": ["Purane patton ka peela padna aur murjhana", "Corm (tane ke neeche) mein laal-bhoora rang"],
        "treatment": ["Koi chemical ilaaj nahin", "Rog-mukt tissue culture paudhe istemal karein"],
    },
    "disease9": {
        "crop": "Soybean (सोयाबीन)",
        "disease_name": "Rust (रस्ट)",
        "severity": "High (उच्च)",
        "symptoms": ["Patton ke neeche chote, lal-bhoore pustules", "Samay se pehle patton ka girna"],
        "treatment": ["Azoxystrobin fungicide", "Jaldi roktham spray"],
    },
    "disease10": {
        "crop": "Groundnut (मूंगफली)",
        "disease_name": "Tikka Disease (Leaf Spot) (टिक्का रोग)",
        "severity": "Medium (मध्यम)",
        "symptoms": ["Patton par peele ghere ke saath gol bhoore dhabbe", "Bhari patton ka girna"],
        "treatment": ["Chlorothalonil fungicide", "Mancozeb spray"],
    },
    "disease11": {
        "crop": "Chickpea (चना)",
        "disease_name": "Fusarium Wilt (फ्यूजेरियम विल्ट)",
        "severity": "High (उच्च)",
        "symptoms": ["Achanak paudhe ka murjhana aur sookh jaana", "Tane mein nas ka rang badalna"],
        "treatment": ["Koi chemical ilaaj nahin", "Jeevaanu agent ke saath beej upchar"],
    },
    "disease12": {
        "crop": "Citrus (नींबू)",
        "disease_name": "Citrus Canker (सिट्रस कैंकर)",
        "severity": "Medium (मध्यम)",
        "symptoms": ["Patton, tano aur phalon par ubhre, kark (corky) ghav", "Dhabbon ke charon or peela ghera"],
        "treatment": ["Copper spray", "Sankramit shakhaon ko kaatna"],
    },
    "disease13": {
        "crop": "Grape (अंगूर)",
        "disease_name": "Downy Mildew (रोमिल फफूंदी)",
        "severity": "High (उच्च)",
        "symptoms": ["Upar ki satah par peele dhabbe", "Patton ke neeche safed fungal growth"],
        "treatment": ["Mancozeb ya Copper oxychloride spray", "Achhi hawa ka sanchalan"],
    },
    "disease14": {
        "crop": "Coffee (कॉफी)",
        "disease_name": "Coffee Leaf Rust (कॉफी पत्ती रस्ट)",
        "severity": "High (उच्च)",
        "symptoms": ["Patton ke neeche chote peele-naarangi powder jaise dhabbe", "Patton ka girna"],
        "treatment": ["Systemic fungicides (e.g., Triadimefon)", "Chhaya prabandhan"],
    },
    "disease15": {
        "crop": "Cotton (कपास)",
        "disease_name": "Leaf Roll Virus (CLRV) (पत्ती रोल वायरस)",
        "severity": "Medium (मध्यम)",
        "symptoms": ["Upar ke patton ka ghumna (rolling)", "Purane patton ka laal padna"],
        "treatment": ["Vector control (aphids)", "Certified virus-free beej ka upyog"],
    },
    // Dummy entry for a healthy result simulation
    "healthy": {
        "crop": "Various (विभिन्न)", 
        "disease_name": "Healthy Plant (स्वस्थ पौधा)", 
        "severity": "None (कुछ नहीं)", 
        "symptoms": ["Koi bimari ke lakshan nahin hain, paudha bilkul theek hai."], 
        "treatment": ["Regular nigrani (monitoring) jaari rakhein aur aage bhi achhi dekhbhaal karein."]
    }
};

// --- SIMULATION LOGIC (Backend se laaye gaye functions) ---

const calculateEnvironmentalRisk = (temperature, humidity, rainfall) => {
    let risk_score = 0;
    
    // Simple Risk Logic (jo original Python code mein tha)
    if (temperature > 30 || temperature < 15) risk_score += 30;
    else if (temperature > 28 || temperature < 18) risk_score += 15;
        
    if (humidity > 80) risk_score += 35;
    else if (humidity > 70) risk_score += 20;
    else if (humidity < 40) risk_score += 10;
        
    if (rainfall > 10) risk_score += 35;
    else if (rainfall > 5) risk_score += 15;
        
    return Math.min(risk_score, 100);
};

// --- REACT COMPONENT ---

const CropDiseaseSystem = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('detect');
    const [envData, setEnvData] = useState({
        temperature: 28, // Default
        humidity: 65,    // Default
        rainfall: 5      // Default
    });
    const [riskScore, setRiskScore] = useState(null);
    const fileInputRef = useRef(null);

    
    // Risk level ka color aur text set karna
    const getRiskLevel = (score) => {
        if (score < 30) return { level: 'Low (कम)', color: 'text-green-600', bg: 'bg-green-50' };
        if (score < 60) return { level: 'Medium (मध्यम)', color: 'text-yellow-600', bg: 'bg-yellow-50' };
        return { level: 'High (उच्च)', color: 'text-red-600', bg: 'bg-red-50' };
    };

    // Image upload handle karna
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setPrediction(null); // Naya image upload hone par purana prediction hata do
            };
            reader.readAsDataURL(file);
        }
    };

    // Disease prediction ko simulate karna (jo pehle API karta tha)
    const analyzeCrop = () => {
        if (!selectedImage) {
            // Hum alert() ki jagah custom message use karenge
            console.error('Pehle ek image upload karo, boss!');
            setPrediction({ info: { crop: 'Error', disease_name: 'No Image Uploaded', severity: 'High', symptoms: ['Please upload an image of the crop leaf or plant to start the analysis.'], treatment: ['Try again after uploading a photo.'] } });
            return;
        }

        setLoading(true);
        setPrediction(null);
        
        // 2 second ka delay daala hai, jisse lage ki AI model chal raha hai
        setTimeout(() => {
            try {
                const diseaseKeys = Object.keys(DISEASE_INFO);
                // 10% chance for a 'healthy' result
                const predictedKey = Math.random() < 0.1 ? 'healthy' : diseaseKeys[Math.floor(Math.random() * (diseaseKeys.length - 1))];
                
                // Confidence score (70% se 95% ke beech)
                const confidence = (0.70 + Math.random() * 0.25);
                
                setPrediction({
                    disease_key: predictedKey,
                    confidence: confidence,
                    info: DISEASE_INFO[predictedKey]
                });

            } catch (error) {
                console.error('Simulation Error:', error);
                // Fallback error message for user
                setPrediction({ info: { crop: 'Error', disease_name: 'Analysis Failed', severity: 'Very High', symptoms: ['Something went wrong with the AI analysis simulation.'], treatment: ['Check console for errors.'] } });
            } finally {
                setLoading(false);
            }
        }, 2000); // 2000ms = 2 seconds simulation time
    };
    
    // Environmental Risk score ko calculate karna aur state mein update karna
    useEffect(() => {
        // Yeh function har baar envData change hone par chalta hai (jaise sliders move karne par)
        const score = calculateEnvironmentalRisk(envData.temperature, envData.humidity, envData.rainfall);
        setRiskScore(score);
    }, [envData]); // Jab bhi envData badlega, tab yeh effect run hoga

    const riskLevel = getRiskLevel(riskScore || 0);

    
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-100 font-sans">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center mb-4">
                        <Leaf className="w-14 h-14 text-green-600 mr-4" />
                        <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">CropGuard AI</h1>
                    </div>
                    <p className="text-gray-600 text-xl font-medium">AI-Powered Fasal Rog (Disease) Pehchaan aur Prabandhan System</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white rounded-xl shadow-2xl shadow-green-200 p-2 inline-flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab('detect')}
                            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all text-lg ${activeTab === 'detect' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <Camera className="inline mr-2 w-5 h-5" />Disease Pehchaan
                        </button>
                        <button
                            onClick={() => setActiveTab('monitor')}
                            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all text-lg ${activeTab === 'monitor' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <TrendingUp className="inline mr-2 w-5 h-5" />Risk Monitoring
                        </button>
                        <button
                            onClick={() => setActiveTab('database')}
                            className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all text-lg ${activeTab === 'database' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            <FileText className="inline mr-2 w-5 h-5" />Poochhi (Database)
                        </button>
                    </div>
                </div>


                {/* CONTENT AREA */}

                {/* Disease Detection Tab */}
                {activeTab === 'detect' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Fasal ki Photo Upload Karein</h2>
                            
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Image Upload Area */}
                                <div className="col-span-1">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><Upload className="w-5 h-5 mr-2"/> Upload Photo</h3>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-4 border-dashed border-gray-300 rounded-xl p-6 md:p-12 h-64 flex items-center justify-center text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all relative group"
                                    >
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg shadow-md transition-opacity duration-300 group-hover:opacity-80"/>
                                        ) : (
                                            <div className="p-4">
                                                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                                                <p className="text-gray-600 font-medium text-lg">Click ya Tap karke Image Chunein</p>
                                                <p className="text-sm text-gray-500 mt-1">Leaf ya Plant ka saaf photo upload karein</p>
                                            </div>
                                        )}
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                                    
                                    <button
                                        onClick={analyzeCrop}
                                        disabled={!selectedImage || loading}
                                        className={`w-full mt-6 py-4 rounded-xl font-bold text-white text-xl transition-all shadow-lg ${!selectedImage || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-xl hover:scale-[1.01] transform'}`}
                                    >
                                        {loading ? (<span className="flex items-center justify-center"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>Analysis Chal Rahi Hai...</span>) : ('Result Dekhein (Analyze Karein)')}
                                    </button>
                                </div>
                                
                                {/* Prediction Results */}
                                <div className="col-span-1">
                                    <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/> Analysis Result</h3>
                                    {prediction && prediction.info ? (
                                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200 shadow-inner space-y-4">
                                            <div className="flex items-center mb-4 pb-2 border-b">
                                                {prediction.info.severity.includes('None') ? (<CheckCircle className="w-8 h-8 text-green-600 mr-3 shrink-0" />) : (<AlertTriangle className="w-8 h-8 text-red-600 mr-3 shrink-0" />)}
                                                <div>
                                                    <h3 className="text-2xl font-extrabold text-gray-800">{prediction.info.crop}: {prediction.info.disease_name}</h3>
                                                    <p className="text-gray-600 font-medium">Vishwas (Confidence): <span className="text-green-700 font-bold">{(prediction.confidence * 100).toFixed(1)}%</span></p>
                                                </div>
                                            </div>
                                            
                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                <h4 className="font-bold text-gray-800 mb-2 text-lg">Symptoms (लक्षण):</h4>
                                                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                                                    {prediction.info.symptoms.map((item, idx) => (<li key={idx}>{item}</li>))}
                                                </ul>
                                            </div>
                                            <div className="bg-white rounded-lg p-4 shadow-sm">
                                                <h4 className="font-bold text-gray-800 mb-2 text-lg">Treatment (इलाज ke Sujhav):</h4>
                                                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                                                    {prediction.info.treatment.map((item, idx) => (<li key={idx}>{item}</li>))}
                                                </ul>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 text-center p-10 rounded-xl border border-dashed border-gray-300 h-full flex items-center justify-center">
                                            <p className="text-gray-500 font-medium">Result yahaan dikhega jab aap photo upload karke **Analyze** button dabayenge.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Risk Monitoring Tab */}
                {activeTab === 'monitor' && (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Mausam se Hone waale Risk ka Pata Lagayein</h2>

                            {/* Risk Score Display */}
                            <div className={`rounded-xl p-8 mb-10 text-center shadow-lg border-4 ${riskLevel.bg} border-current ${riskLevel.color.replace('text-', 'border-')}`}>
                                <p className="text-gray-700 mb-3 text-xl font-semibold">Aapke diye gaye Mausam ke anusaar:</p>
                                <div className={`text-7xl font-extrabold ${riskLevel.color} mb-3`}>{riskScore}%</div>
                                <span className={`inline-block px-8 py-3 rounded-full font-bold text-2xl text-white shadow-md ${riskLevel.color.replace('text-', 'bg-')}`}>{riskLevel.level} Risk</span>
                            </div>

                            {/* Environmental Parameters (Sliders) */}
                            <div className="space-y-6">
                                {/* Temperature */}
                                <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="font-bold text-gray-800 text-lg flex items-center"><Thermometer className="w-6 h-6 text-red-500 mr-3" /> Temperature (°C)</label>
                                        <span className="text-2xl font-bold text-red-600">{envData.temperature}°C</span>
                                    </div>
                                    <input type="range" min="10" max="45" value={envData.temperature} onChange={(e) => setEnvData({ ...envData, temperature: parseInt(e.target.value) })} className="w-full h-3 bg-gradient-to-r from-blue-400 via-green-400 to-red-500 rounded-lg appearance-none cursor-pointer" style={{'--webkit-slider-thumb-color': 'red'}}/>
                                </div>
                                {/* Humidity */}
                                <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="font-bold text-gray-800 text-lg flex items-center"><Droplets className="w-6 h-6 text-blue-500 mr-3" /> Humidity (%)</label>
                                        <span className="text-2xl font-bold text-blue-600">{envData.humidity}%</span>
                                    </div>
                                    <input type="range" min="20" max="100" value={envData.humidity} onChange={(e) => setEnvData({ ...envData, humidity: parseInt(e.target.value) })} className="w-full h-3 bg-gradient-to-r from-yellow-300 to-blue-500 rounded-lg appearance-none cursor-pointer"/>
                                </div>
                                {/* Rainfall */}
                                <div className="bg-gray-50 rounded-xl p-6 shadow-inner">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="font-bold text-gray-800 text-lg flex items-center"><Wind className="w-6 h-6 text-gray-500 mr-3" /> Rainfall (mm/day)</label>
                                        <span className="text-2xl font-bold text-gray-700">{envData.rainfall}mm</span>
                                    </div>
                                    <input type="range" min="0" max="20" value={envData.rainfall} onChange={(e) => setEnvData({ ...envData, rainfall: parseInt(e.target.value) })} className="w-full h-3 bg-gradient-to-r from-gray-300 to-blue-600 rounded-lg appearance-none cursor-pointer"/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Disease Database Tab */}
                {activeTab === 'database' && (
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Fasal Rogon ka Data (Sample)</h2>
                            <p className="text-gray-600 mb-8 text-center">Yahaan kuch khaas fasalon ke rogon ki jaankari di gayi hai.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(DISEASE_INFO).filter(([key]) => key !== 'healthy').map(([key, info]) => (
                                    <div key={key} className="bg-gradient-to-br from-white to-green-50 border-2 border-green-300 rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]">
                                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${info.severity.includes('Very High') ? 'bg-red-100 text-red-700' : info.severity.includes('High') ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {info.severity}
                                        </div>
                                        <h3 className="font-extrabold text-xl text-gray-800 mb-2">{info.crop}: {info.disease_name}</h3>
                                        <p className="text-sm text-gray-700 font-medium mb-3">
                                            <span className="font-bold">Main Lakshan:</span> {info.symptoms[0]}...
                                        </p>
                                        <p className="text-sm text-green-700 font-semibold border-t pt-3 mt-3">
                                            <span className="font-bold">Mukhya Ilaaj:</span> {info.treatment[0]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropDiseaseSystem;
