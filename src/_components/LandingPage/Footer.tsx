import { Type } from 'lucide-react'


const Footer = () => {
    return (
        <footer className="bg-white border-t border-slate-200 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-3 mb-6 md:mb-0">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                            <Type className="w-5 h-5 text-white" />

                        </div>
                        <span className="text-lg font-semibold text-slate-900">TypeTester</span>
                    </div>

                    <div className="flex items-center space-x-8">
                        <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Privacy</a>
                        <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Terms</a>
                        <a href="#" className="text-slate-600 hover:text-slate-900 transition-colors">Support</a>
                    </div>
                </div>

                <div className="border-t border-slate-200 mt-8 pt-8 text-center">
                    <p className="text-slate-500">© 2025 TypeTester. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer