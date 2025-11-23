import React, { useState } from 'react';
import { generateSongs } from './services/geminiService';
import { Song, GeneratorFormData } from './types';
import SongCard from './components/SongCard';
import LoadingState from './components/LoadingState';
import { jsPDF } from "jspdf";

// --- CONFIGURAÇÃO DA SENHA ---
// Altere o valor abaixo para mudar a senha de acesso
const APP_PASSWORD = "esther87"; 

const App: React.FC = () => {
  // Estado de Autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState(false);

  // Estados do App Principal
  const [formData, setFormData] = useState<GeneratorFormData>({
    topic: '',
    rhythm: '',
  });
  
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- LÓGICA DE LOGIN ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === APP_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // --- LÓGICA DO PDF ---
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);

    // CAPA
    doc.setFillColor(15, 23, 42); // Cor escura (simulada)
    doc.rect(0, 0, pageWidth, 297, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.text("SUNO ARCHITECT", pageWidth / 2, 100, { align: "center" });
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(`Tema: ${formData.topic.substring(0, 40)}...`, pageWidth / 2, 120, { align: "center" });
    doc.text(`Ritmo: ${formData.rhythm}`, pageWidth / 2, 130, { align: "center" });
    
    doc.setFontSize(10);
    doc.text("Gerado por IA", pageWidth / 2, 280, { align: "center" });

    // PÁGINAS DAS MÚSICAS
    songs.forEach((song, index) => {
      doc.addPage();
      
      // Reset cor texto para preto (para impressão) ou manter escuro se preferir, 
      // mas padrão PDF geralmente é fundo branco texto preto para economizar tinta.
      // Vamos fazer fundo branco para o conteúdo ser imprimível.
      doc.setTextColor(0, 0, 0);

      // Título
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(`#${index + 1} - ${song.title}`, margin, 30);

      // Style Prompt
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Prompt de Estilo (Suno):", margin, 45);
      
      doc.setFont("courier", "normal");
      doc.setTextColor(76, 29, 149); // Roxo
      const splitPrompt = doc.splitTextToSize(song.stylePrompt, maxLineWidth);
      doc.text(splitPrompt, margin, 52);

      // Letra
      const promptHeight = splitPrompt.length * 5;
      const lyricsStartY = 60 + promptHeight;

      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text("Letra:", margin, lyricsStartY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const splitLyrics = doc.splitTextToSize(song.lyrics, maxLineWidth);
      doc.text(splitLyrics, margin, lyricsStartY + 8);
    });

    doc.save("Suno_Architect_Roteiro.pdf");
  };

  // --- LÓGICA DO APP PRINCIPAL ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setSongs([]);

    try {
      const response = await generateSongs(formData.topic, formData.rhythm);
      if (response && response.songs) {
        setSongs(response.songs);
      } else {
        setError('O formato da resposta foi inválido. Tente novamente.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao gerar as músicas. Verifique sua conexão ou tente simplificar o pedido.');
    } finally {
      setIsLoading(false);
    }
  };

  // RENDERIZAÇÃO CONDICIONAL: TELA DE LOGIN OU APP
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-dark-800 rounded-xl shadow-2xl p-8 border border-dark-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-suno-400 to-purple-500 mb-2">
              Acesso Restrito
            </h1>
            <p className="text-gray-400">Suno Architect</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Senha de Acesso</label>
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-suno-500 focus:border-transparent outline-none transition-all"
                placeholder="Digite a senha..."
              />
              {authError && (
                <p className="text-red-400 text-sm mt-2">Senha incorreta.</p>
              )}
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-suno-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-suno-500/25 transition-all"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // APP PRINCIPAL
  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 pb-20">
      {/* Hero / Header Section */}
      <header className="bg-gradient-to-b from-dark-800 to-dark-900 border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-suno-400 via-purple-500 to-indigo-500 mb-3">
              Suno Architect
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Produção musical profissional. Gere 10 letras formatadas e prompts de ritmo perfeitos.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Input Card */}
        <div className="bg-dark-800 rounded-2xl shadow-2xl shadow-black/50 border border-dark-700 p-6 md:p-8 mb-12 relative z-10 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              
              {/* Topic Input */}
              <div className="space-y-2">
                <label htmlFor="topic" className="block text-sm font-bold text-gray-300 uppercase tracking-wide">
                  1. Sobre o que é a música?
                </label>
                <textarea
                  id="topic"
                  name="topic"
                  rows={2}
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-suno-500 focus:border-transparent transition duration-200 resize-none text-lg"
                  placeholder="Ex: Uma viagem noturna de carro pensando em um amor antigo..."
                  value={formData.topic}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Rhythm Input */}
              <div className="space-y-2">
                <label htmlFor="rhythm" className="block text-sm font-bold text-gray-300 uppercase tracking-wide">
                  2. Qual o Ritmo / Estilo?
                </label>
                <input
                  type="text"
                  id="rhythm"
                  name="rhythm"
                  className="w-full bg-dark-900 border border-dark-600 rounded-lg px-4 py-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-lg"
                  placeholder="Ex: Synthwave Anos 80, Vocal Feminino, 120bpm"
                  value={formData.rhythm}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !formData.topic || !formData.rhythm}
                className={`
                  w-full py-5 rounded-xl font-bold text-xl shadow-lg transform transition-all duration-200 flex items-center justify-center space-x-2
                  ${isLoading || !formData.topic || !formData.rhythm
                    ? 'bg-dark-700 text-gray-500 cursor-not-allowed border border-dark-600' 
                    : 'bg-gradient-to-r from-suno-600 to-purple-700 text-white hover:scale-[1.01] hover:shadow-suno-500/25 border border-suno-500/50'}
                `}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Criando Obras-Primas...</span>
                  </>
                ) : (
                  <>
                    <span>Gerar 10 Músicas</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Output Section */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-300 px-6 py-4 rounded-lg mb-8 text-center max-w-4xl mx-auto">
            {error}
          </div>
        )}

        {isLoading && <LoadingState />}

        {!isLoading && songs.length > 0 && (
          <div className="animate-fade-in-up pb-12">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="bg-suno-600 w-2 h-8 rounded-full"></span>
                Resultados Prontos
              </h2>
              
              {/* Botão Exportar PDF */}
              <button
                onClick={handleExportPDF}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow-lg shadow-green-900/20 flex items-center gap-2 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Baixar Roteiro em PDF
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {songs.map((song, index) => (
                <SongCard key={index} song={song} index={index} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && songs.length === 0 && !error && (
           <div className="text-center py-12 opacity-40">
             <div className="inline-block p-6 rounded-full bg-dark-800 mb-4">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
             </div>
             <p className="text-lg font-medium text-gray-400">Aguardando sua inspiração...</p>
           </div>
        )}
      </main>
    </div>
  );
};

export default App;