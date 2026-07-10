import React from 'react';
import Image from 'next/image';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-[calc(100vw-2rem)] sm:w-full md:max-w-md max-h-[90vh] overflow-y-auto transform transition-all">
        <div className="p-3 sm:p-6">
          <div className="flex justify-between items-center mb-3 sm:mb-5">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent font-serif italic flex items-center" style={{ fontFamily: "'Brush Script MT', cursive, serif" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#f472b6" />
                <path d="M2 17l10 5 10-5" stroke="#f472b6" />
                <path d="M2 12l10 5 10-5" stroke="#f472b6" />
              </svg>
              📱 扫码关注我们
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-center">
            <p className="mb-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 break-words">
              扫码关注我们的抖音，获取更多拼豆创意和店铺活动信息 🧋
            </p>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-300 break-words">
              在店里拼豆的时候别忘了@我们，你的作品可能会被官方翻牌哦 ✨
            </p>
            <div className="flex justify-center mb-4 sm:mb-5">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 p-1 sm:p-2 bg-gradient-to-r from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-lg shadow-md">
                <Image
                  src="/douyin_qr.png"
                  alt="抖音二维码"
                  fill
                  className="object-contain p-1 sm:p-2"
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 py-1.5 px-3 sm:py-2 sm:px-4 rounded-full inline-block shadow-sm">
              抖音搜索：Pixel beads 我嘞个豆
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
