import { joinVoiceChannel } from '@discordjs/voice';

export default {
    name: 'stay',
    description: 'جعل البوت يبقى في الروم الصوتي 24/7',
    category: 'Utility',
    run: async (client, message, args) => {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply('يجب أن تكون في روم صوتي أولاً!');

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator,
            });

            // منع البوت من الخروج التلقائي عند عدم تشغيل صوت
            connection.on('stateChange', (oldState, newState) => {
                if (newState.status === 'disconnected') {
                    // إعادة الاتصال تلقائياً إذا فُصل لأي سبب
                    joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: message.guild.id,
                        adapterCreator: message.guild.voiceAdapterCreator,
                    });
                }
            });

            await message.reply('تم تثبيت البوت في الروم الصوتي على مدار الساعة! ⏱️');
        } catch (error) {
            console.error(error);
            await message.reply('حدث خطأ أثناء محاولة تثبيت البوت.');
        }
    }
};
