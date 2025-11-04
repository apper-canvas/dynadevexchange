import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8 max-w-md mx-auto">
        <div className="text-6xl text-gray-400 mb-4">
          <ApperIcon name="AlertCircle" size={80} className="mx-auto" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          404 - Page Not Found
        </h1>
        
        <p className="text-gray-600 text-lg leading-relaxed">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4 pt-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-accent transition-colors duration-200 font-medium"
          >
            <ApperIcon name="Home" size={20} />
            Go to Homepage
          </Link>
          
          <div className="text-gray-500 text-sm">
            Or browse our <Link to="/questions" className="text-primary hover:underline">latest questions</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;