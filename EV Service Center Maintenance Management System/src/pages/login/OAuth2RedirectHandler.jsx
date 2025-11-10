import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const role = searchParams.get('role');
        const avatar = searchParams.get('avatar');
        const userID = searchParams.get('userID');
        const refId = searchParams.get('refId');
        
        // console.log('OAuth2 Redirect - Received params:', { token, email, name, role, avatar });
        console.log('OAuth2 Redirect - Received params:', { 
            token: token ? 'exists' : 'missing',
            email, 
            name, 
            role, 
            userID, 
            refId 
        });

        if (token) {
            // Lưu token và user info
            localStorage.setItem('token', token);
            
            //Decode name và avatar
            const decodedName = name ? decodeURIComponent(name) : '';
            const decodedAvatar = avatar ? decodeURIComponent(avatar) : '';
            
            //Tạo userData với ĐẦY ĐỦ thông tin
            const userData = {
                userID: parseInt(userID),           //userID
                email,
                name: decodedName,
                fullName: decodedName,
                role,
                avatar: decodedAvatar,
                pictureUrl: decodedAvatar,
                refid: refId ? parseInt(refId) : null,  //refId
                id: parseInt(userID),               //alias cho userID
                customerId: refId ? parseInt(refId) : parseInt(userID)  //customerId
            };
            
            //Lưu user data
            localStorage.setItem('user', JSON.stringify(userData));
            
            //Lưu customerId riêng (để các page khác dễ truy cập)
            const customerId = refId ? refId : userID;
            if (customerId) {
                localStorage.setItem('customerId', customerId);
                console.log('✅ Saved customerId:', customerId);
            }
            
            console.log('✅ Đã lưu token và user info vào localStorage');
            console.log('👤 User data:', userData);
            
            // Redirect theo role
            const roleNormalized = role?.toLowerCase().trim();
            
            if (roleNormalized === 'admin') {
                console.log('🔄 Redirecting to /admin/home');
                navigate('/admin/home');
            } else if (roleNormalized === 'staff') {
                console.log('🔄 Redirecting to /staffdash');
                navigate('/staffdash');
            } else if (roleNormalized === 'technician') {
                console.log('🔄 Redirecting to /techniciandash');
                navigate('/techniciandash');
            } else if (roleNormalized === 'customer') {
                console.log('🔄 Redirecting to /');
                navigate('/');
            } else {
                console.warn('⚠️ Unknown role:', role);
                navigate('/');
            }
        } else {
            console.error('❌ No token received from OAuth2');
            alert('Đăng nhập Google thất bại. Vui lòng thử lại!');
            navigate('/login');
        }
    }, [searchParams, navigate]);
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-100">
            <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Đang xử lý đăng nhập
                </h2>
                <p className="text-gray-600">
                    Vui lòng đợi trong giây lát...
                </p>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;