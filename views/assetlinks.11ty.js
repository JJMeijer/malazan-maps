class AssetLinks {
    data() {
        return {
            permalink: ".well-known/assetlinks.json",
        };
    }

    render() {
        const data = [
            {
                relation: ["delegate_permission/common.handle_all_urls"],
                target: {
                    namespace: "android_app",
                    package_name: "com.malazanmaps.www.twa",
                    sha256_cert_fingerprints: [
                        "ED:47:F5:21:C9:98:06:ED:D2:22:4F:39:52:FB:97:2F:24:C9:20:8C:54:1A:7C:98:5B:86:44:D3:D1:28:71:FA",
                    ],
                },
            },
        ];

        return JSON.stringify(data);
    }
}

export default AssetLinks;
