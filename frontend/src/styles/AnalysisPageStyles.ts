const AnalysisPageStyles = {
    container: "min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-green-50 to-emerald-50 relative overflow-hidden",
    backgroundCircles: "absolute inset-0 flex items-center justify-center z-0 pointer-events-none",
    circle1: "w-40 h-40 sm:w-64 sm:h-64 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 blur-2xl sm:blur-3xl opacity-30 animate-spin-slow absolute -top-20 -left-20",
    circle2: "w-32 h-32 sm:w-48 sm:h-48 lg:w-80 lg:h-80 rounded-full bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 blur-2xl sm:blur-3xl opacity-30 animate-spin-reverse-slow absolute -bottom-20 -right-20",
    content: "relative z-10 flex flex-col items-center space-y-8 px-6 py-12 max-w-lg mx-auto",
    tube1: "absolute top-8 left-4 sm:left-12 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 animate-float opacity-80 drop-shadow-lg",
    tube2: "absolute top-8 right-4 sm:right-12 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 animate-float opacity-80 drop-shadow-lg",
    tube3: "absolute bottom-8 left-4 sm:left-12 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 animate-float opacity-80 drop-shadow-lg",
    tube4: "absolute bottom-8 right-4 sm:right-12 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 animate-float opacity-80 drop-shadow-lg",
    // Fixed size image - won't change on scroll
    scientistImage: "w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 object-contain relative z-20 drop-shadow-2xl",
    startButton: "bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl lg:text-2xl font-bold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300 z-30 shadow-xl hover:shadow-2xl hover:scale-105 transform",
  };
  
  export default AnalysisPageStyles;