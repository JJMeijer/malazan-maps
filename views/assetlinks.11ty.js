class AssetLinks {
    data() {
        return {
            permalink: '.well-known/assetlinks.json',
        };
    }

    render() {
        const data = [
            {
                relation: ['delegate_permission/common.handle_all_urls'],
                target: {
                    namespace: 'android_app',
                    package_name: 'com.malazanmaps.www.twa',
                    sha256_cert_fingerprints: [
                        '7C:97:40:C2:4B:93:5A:A3:AA:0E:97:7C:09:7C:49:59:37:BE:F6:FA:40:AE:6D:88:BB:5A:4D:9C:8D:97:D6:D0',
                    ],
                },
            },
        ];

        return JSON.stringify(data);
    }
}

module.exports = AssetLinks;
