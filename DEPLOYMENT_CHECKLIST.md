# 🚀 OrderApp Deployment Checklist (Short Form)

## 📋 Pre-Deployment
1. **Developer Account**: Create Google Play Console ($25 one-time).
2. **Assets Ready**:
   - **Icon**: 1024x1024px PNG (no transparency).
   - **Graphic**: 1024x500px Feature Graphic.
   - **Screenshots**: At least 2 phone screens (1080x1920px).
3. **Privacy Policy**: Host a simple URL (required by Google).

## 🔐 Build & Sign
Generate your production files using EAS:
- **For Play Store (AAB)**:
  `eas build --platform android --profile production`
- **For Internal Testing (APK)**:
  `eas build --platform android --profile preview`

## 📦 Play Console Steps
1. **Create App**: Set name to "OrderApp", type as "App", and "Free".
2. **Main Store Listing**: Upload Icon, Graphic, and Screenshots.
3. **App Content**:
   - Complete **Privacy Policy** URL.
   - Complete **Content Rating** questionnaire.
   - Complete **Data Safety** section.
4. **Production Release**:
   - Go to **Production** > **Create new release**.
   - Upload the `.aab` file from EAS.
   - Add release notes (e.g., "Initial launch").
5. **Review**: Submit for review (takes 3-7 days).

## ✅ Maintenance
- Monitor **Vitals** for crashes.
- Respond to user reviews.
- Update app version in `app.json` for new features.
