import { useState } from 'react';
import { processImage } from './api';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [provider, setProvider] = useState('huggingface');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedImage || !prompt) {
      setError('Please select an image and enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await processImage(selectedImage, prompt, provider);
      setResult(response.result);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process image');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrompt('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎨 AI Image Editor</h1>
        <p>Transform your images with AI</p>
      </header>

      <main className="app-main">
        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label htmlFor="image-upload" className="upload-label">
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="prompt">Prompt</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe how you want to edit the image..."
              rows="4"
              className="prompt-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="provider">AI Provider</label>
            <select
              id="provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="provider-select"
              disabled
            >
              <option value="huggingface">Hugging Face (Free)</option>
            </select>
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              disabled={loading || !selectedImage || !prompt}
              className="btn btn-primary"
            >
              {loading ? 'Processing...' : 'Process Image'}
            </button>
            <button 
              type="button" 
              onClick={resetForm}
              className="btn btn-secondary"
            >
              Reset
            </button>
          </div>
        </form>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="result-section">
            <h2>Result</h2>
            <div className="result-content">
              <p><strong>Provider:</strong> {result.provider}</p>
              <p><strong>Prompt:</strong> {result.prompt}</p>
              {result.imageUrl && (
                <div className="result-image">
                  <img src={result.imageUrl} alt="Processed" />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
