import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, onSubmit, barberName, serviceName }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    await onSubmit({ rating, comment });
    setSubmitting(false);
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" data-testid="review-modal">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-md border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h3 className="text-xl font-bold text-white">Avaliar Serviço</h3>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-zinc-400 mb-2">Como foi sua experiência com</p>
            <p className="text-white text-lg font-medium">{barberName}?</p>
            {serviceName && (
              <p className="text-amber-500 text-sm mt-1">{serviceName}</p>
            )}
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
                data-testid={`star-${star}`}
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoverRating || rating)
                      ? 'fill-amber-500 text-amber-500'
                      : 'text-zinc-600'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {/* Rating text */}
          <div className="text-center mb-6">
            {rating === 1 && <span className="text-red-400">Muito ruim 😞</span>}
            {rating === 2 && <span className="text-orange-400">Ruim 😕</span>}
            {rating === 3 && <span className="text-yellow-400">Regular 😐</span>}
            {rating === 4 && <span className="text-lime-400">Bom 🙂</span>}
            {rating === 5 && <span className="text-green-400">Excelente! 🤩</span>}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-zinc-400 text-sm mb-2">
              Comentário (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Conte como foi sua experiência..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-amber-500"
              rows={3}
              data-testid="review-comment"
            />
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="w-full bg-amber-500 text-black font-bold py-3 rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            data-testid="submit-review"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Avaliação
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
