import React from 'react';

const TeamMemberCard: React.FC<{ name: string; role: string; avatarUrl: string; bio: string }> = ({ name, role, avatarUrl, bio }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg text-center border border-gray-700">
        <img src={avatarUrl} alt={name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-600" />
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-purple-400 font-semibold mb-3">{role}</p>
        <p className="text-neutral-400 text-sm">{bio}</p>
    </div>
);

const AboutPage: React.FC = () => {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                    Về <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">LC Blog</span>
                </h1>
                <p className="max-w-3xl mx-auto text-lg md:text-xl text-neutral-300">
                    Cầu nối giữa bạn và thế giới công nghệ không ngừng biến đổi.
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                    <h2 className="text-3xl font-bold text-white mb-4">Sứ mệnh của chúng tôi</h2>
                    <p className="text-neutral-300 leading-relaxed">
                        Tại LC Blog, sứ mệnh của chúng tôi là làm sáng tỏ những sự phức tạp của ngành công nghệ. Chúng tôi mong muốn cung cấp những bài viết sâu sắc, hướng dẫn thực tế và tin tức cập nhật nhất một cách dễ hiểu và hấp dẫn. Chúng tôi tin rằng kiến thức công nghệ là sức mạnh, và mọi người, từ người mới bắt đầu đến các chuyên gia dày dạn kinh nghiệm, đều có quyền tiếp cận nó.
                    </p>
                </div>

                <div className="bg-gray-900 p-8 rounded-xl border border-gray-800">
                    <h2 className="text-3xl font-bold text-white mb-4">Tầm nhìn của chúng tôi</h2>
                    <p className="text-neutral-300 leading-relaxed">
                        Chúng tôi hướng tới việc trở thành một cộng đồng sôi nổi, nơi những người đam mê công nghệ có thể kết nối, học hỏi và cùng nhau phát triển. Tầm nhìn của chúng tôi là xây dựng một nền tảng đáng tin cậy, không chỉ chia sẻ thông tin mà còn khơi nguồn cảm hứng, thúc đẩy sự sáng tạo và định hình các cuộc thảo luận về tương lai của công nghệ.
                    </p>
                </div>

                <div className="text-center">
                     <h2 className="text-3xl font-bold text-white mb-8">Gặp gỡ đội ngũ</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <TeamMemberCard 
                            name="AdminLC"
                            role="Nhà sáng lập & Tổng biên tập"
                            avatarUrl="https://picsum.photos/seed/admin-avatar/100/100"
                            bio="Với niềm đam mê mãnh liệt về AI và phần cứng, AdminLC thành lập blog này để chia sẻ kiến thức chuyên sâu và những phân tích sắc bén về các xu hướng công nghệ định hình tương lai."
                        />
                         <TeamMemberCard 
                            name="UserTech"
                            role="Chuyên gia Phát triển Web & Di động"
                            avatarUrl="https://picsum.photos/seed/user-avatar/100/100"
                            bio="Là một nhà phát triển toàn năng, UserTech mang đến những hướng dẫn thực tế, dễ áp dụng và các bài viết chuyên sâu về các framework và công nghệ phát triển ứng dụng mới nhất."
                        />
                     </div>
                </div>
            </div>
        </main>
    );
};

export default AboutPage;
