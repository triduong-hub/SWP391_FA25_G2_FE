import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        console.log('🌐 Full URL:', window.location.href);
        console.log('🔍 Search params:', window.location.search);

        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const name = searchParams.get('name');
        const role = searchParams.get('role');
        const avatar = searchParams.get('avatar');
        const userID = searchParams.get('userID');
        const refId = searchParams.get('refId');
        const phone = searchParams.get('phone');
        const address = searchParams.get('address');
        const birth = searchParams.get('birth');
        const gender = searchParams.get('gender');
        
        // console.log('OAuth2 Redirect - Received params:', { token, email, name, role, avatar });
        console.log('OAuth2 Redirect - Received params:', { 
            token: token ? 'exists' : 'missing',
            email, 
            name, 
            role, 
            userID, 
            phone,
            refId 
        });

        if (token) {
            console.log('🔑 Token length:', token.length);
            console.log('🔑 Token first 50 chars:', token.substring(0, 50));

            // Lưu token và user info
            localStorage.setItem('token', token);
            console.log('💾 Token saved to localStorage');

        //     setTimeout(() => {
        //     const savedToken = localStorage.getItem('token');
        //     console.log('✅ Verify saved token:', savedToken ? 'EXISTS' : 'MISSING');
        //     console.log('✅ Saved token matches:', savedToken === token);
        // }, 100);

            //Decode name và avatar
            const decodedName = name ? decodeURIComponent(name) : '';
            const decodedAvatar = avatar ? decodeURIComponent(avatar) : '';
            const decodedAddress = address ? decodeURIComponent(address) : '';
            const decodedGender = gender ? decodeURIComponent(gender) : '';
            
            //Tạo userData với ĐẦY ĐỦ thông tin
            const userData = {
                userID: parseInt(refId),           //userID
                email,
                name: decodedName,
                fullName: decodedName,
                role,
                avatar: decodedAvatar,
                pictureUrl: decodedAvatar,
                id: parseInt(userID),
                refid: parseInt(refId),  //refId
                customerId: parseInt(refId),//customerId
                phone: phone || '',
                address: decodedAddress,
                birth: birth || '',
                gender: decodedGender
            };
            
            //Lưu user data
            localStorage.setItem('user', JSON.stringify(userData));
            
            //Lưu customerId riêng (để các page khác dễ truy cập)
            const customerId = userData.customerId;
            if (customerId) {
                localStorage.setItem('customerId', customerId);
                console.log('✅ Saved customerId:', customerId);
            }
            
            console.log('✅ Đã lưu token và user info vào localStorage');
            console.log('👤 User data:', userData);

        //     //Test API luôn
        //     setTimeout(async () => {
        //     console.log('🧪 Testing API call...');
        //     const testToken = localStorage.getItem('token');
            
        //     try {
        //         const response = await fetch('http://localhost:8080/api/auth/getUserInfo', {
        //             method: 'GET',
        //             headers: {
        //                 'Authorization': `Bearer ${testToken}`,
        //                 'Content-Type': 'application/json'
        //             }
        //         });
                
        //         console.log('🧪 Test API response status:', response.status);
                
        //         if (response.ok) {
        //             const data = await response.json();
        //             console.log('✅ Test API success:', data);
        //         } else {
        //             console.error('❌ Test API failed:', response.status, response.statusText);
        //         }
        //     } catch (error) {
        //         console.error('❌ Test API error:', error);
        //     }
        // }, 500);
            
            // Redirect theo role
            const roleNormalized = role?.toLowerCase().trim();
            
            if (roleNormalized === 'admin') {
                console.log('🔄 Redirecting to /admin/home');
                navigate('/admin/home');
            } else if (roleNormalized === 'staff') {
                console.log('🔄 Redirecting to /staff/dashboard');
                navigate('/staff/dashboard');
            } else if (roleNormalized === 'technician') {
                console.log('🔄 Redirecting to /technician/dashboard');
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