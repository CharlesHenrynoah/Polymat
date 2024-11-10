import React, { useState } from 'react';
import { X, Mic, StopCircle } from 'lucide-react';

interface TranscribeModalProps {
  onTranscribe: (text: string) => void;
  onClose: () => void;
}

export const TranscribeModal: React.FC<TranscribeModalProps> = ({ onTranscribe, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording for demo
    setTimeout(() => {
      setTranscript("This is a simulated transcription of your speech. In a real implementation, this would use the Web Speech API or a similar service to convert your speech to text.");
      setIsRecording(false);
    }, 3000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const handleUseTranscript = () => {
    onTranscribe(transcript);
  };

  return (
    <div className="absolute bottom-full left-0 right-0 mb-4 mx-4 z-[100]">
      <div className="bg-zinc-900 rounded-lg w-full border border-zinc-800 flex flex-col shadow-2xl">
        <div className="flex-shrink-0 p-3 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Transcribe Speech to Text</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-orange-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex flex-col items-center justify-center min-h-[200px]">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-6 rounded-full transition-all transform hover:scale-105 ${
                isRecording 
                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                  : 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
              }`}
            >
              {isRecording ? (
                <StopCircle className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>

            {isRecording && (
              <div className="text-center text-zinc-400 mt-4 animate-pulse text-sm">
                Recording... Speak clearly into your microphone
              </div>
            )}

            {transcript && (
              <div className="mt-6 w-full">
                <div className="p-3 bg-zinc-800 rounded-lg border border-zinc-700">
                  <p className="text-zinc-100 text-sm">{transcript}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {transcript && (
          <div className="flex-shrink-0 p-3 border-t border-zinc-800 flex justify-end">
            <button
              onClick={handleUseTranscript}
              className="px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              Use Transcript
            </button>
          </div>
        )}
      </div>
    </div>
  );
};