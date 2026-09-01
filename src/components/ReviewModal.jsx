import React, { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';

export default function ReviewModal({ onClose, onReviewSubmitted }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !comment.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, rating, comment })
      });

      if (!response.ok) {
        throw new Error('Failed to submit review. Try again.');
      }

      setSuccess(true);
      setTimeout(() => {
        onReviewSubmitted();
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF9F6] text-[#1F1D1A] w-full max-w-md shadow-2xl border border-[#C5A880]/30 overflow-hidden rounded-none flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0B1325] text-[#FAF9F6] p-5 border-b border-[#C5A880]/20 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-sans font-semibold">Guest Feedback</span>
            <h3 className="font-serif text-base font-bold tracking-wide mt-0.5">Share Your Experience</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#FAF9F6]/70 hover:text-white border border-[#FAF9F6]/10 hover:border-[#C5A880] px-2.5 py-1 text-xs uppercase font-sans font-semibold transition-all"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8 space-y-3 font-sans">
              <Star className="text-amber-500 fill-amber-500 mx-auto animate-bounce" size={44} />
              <h4 className="font-serif text-base font-bold text-gray-900">Review Submitted!</h4>
              <p className="text-xs text-gray-600">Your warm thoughts have been stored on our server.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="bg-red-50 border-l-2 border-red-500 p-3 text-xs text-red-700 font-sans">
                  {errorMsg}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chief Chinedu"
                  className="w-full px-3 py-2 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Star Rating Selector */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Star Rating</label>
                <div className="flex space-x-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="focus:outline-none transition-all p-1"
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= (hoverRating ?? rating)
                            ? 'text-amber-500 fill-amber-500 scale-110'
                            : 'text-gray-300'
                        } transition-transform`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1">Your Review *</label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe your luxurious stay, dining, or lounge experience..."
                  className="w-full px-3 py-2 bg-white border border-gray-300 text-xs focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              {/* Submit */}
              <div className="pt-2 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0B1325] text-[#C5A880] hover:bg-[#C5A880] hover:text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 transition-all flex items-center space-x-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={12} />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
