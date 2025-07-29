import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getUserProfile,
  updateUserLanguage,
} from "../services/userProfileService";

type Language = "en" | "ja";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

// Translation dictionary
const translations = {
  en: {
    language: "Language",
    english: "English",
    japanese: "Japanese",
    select_language: "Select Language",
    home: "Home",
    settings: "Settings",
    ai_chat: "AI Chat",
    maps: "Maps",
    account: "Account",
    logout: "Sign Out",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    immigration_offices: "Immigration Offices",
    photo_booths: "Photo Booths",
    reset_location: "Reset",
    your_location: "Your Location",
    distance: "Distance",
    directions: "Directions",
    call: "Call",
    ai_welcome:
      "Hello! I'm your AI visa application assistant. I can help you fill out your visa extension form step by step. What would you like to know?",
    ai_loading: "Loading immigration offices...",
    ai_loading_photo: "Loading photo booths...",
    ai_quick_tips: "Here are some quick questions you can ask me:",
    full_name: "Full Name",
    address: "Address",
    date_of_birth: "Date of Birth",
    documents: "Documents",
    full_name_desc: "Please enter your full name",
    address_desc: "Please enter your address",
    date_of_birth_desc: "Please enter your date of birth",
    documents_desc: "Please select the documents you have",
    ask_anything_about_visa: "Ask anything about your visa",
    camera: "Camera",
    image: "Image",
    welcome: "Welcome",
    getting_started_message: "Let's get started with your visa application",
    get_started: "Get Started",
    manage_account: "Manage your account settings",
    customize_experience: "Customize your experience",
    get_help_support: "Get help and support",
    privacy_security_settings: "Privacy and security settings",
    welcome_ai_assistant: "Welcome to AI Form Assistant!",
    what_i_can_help: "✨ What I can help you with:",
    form_guidance: "Form Guidance",
    form_guidance_desc: "Get step-by-step help with visa extension forms",
    field_explanations: "Field Explanations",
    field_explanations_desc: "Understand what each field requires",
    how_to_use: "💡 How to use:",
    detailed_explanations: "I'll provide detailed explanations and examples",
    follow_up_questions: "Feel free to ask follow-up questions",
    try_asking_me: "Try asking me:",
    full_name_question: "How do I fill out the full name field?",
    address_format_question: "What format should I use for my address?",
    visa_expiry_question: "Help me with the visa expiry date field",
    lets_start: "Let's start!",
    vizy_ai_assistant: "Vizy AI",
    accessibility: "Accessibility",
    help_support: "Help & Support",
    privacy_security: "Privacy & Security",
    manage_profile_account: "Manage your profile and account settings",
    choose_theme_colors: "Choose your preferred theme and colors",
    get_help_contact_support: "Get help and contact support",
    manage_privacy_security: "Manage your privacy and security settings",
    notification_test: "Notification Test",
    test_push_notifications: "Test push notifications",
    welcome_back: "Welcome back!",
    whats_your_deadline: "What's your deadline?",
    select_your_deadline: "Select your deadline",
    whats_your_current_residency_type: "What's your current Residency type?",
    international_student_residency: "International Student Residency",
    work_residency: "Work Residency",
    family_residency: "Family Residency",
    specified_skill_worker_residency: "Specified Skill Worker Residency",
    what_do_you_want_to_do: "What do you want to do?",
    extend_current_residency: "Extend my current Residency",
    change_to_different_residency_type: "Change to a different Residency type",
    which_documents_do_you_have: "Which documents do you already have?",
    have_you_applied_before: "Have you applied for a Residency before?",
    yes_successfully: "Yes, successfully",
    yes_but_rejected: "Yes, but was rejected",
    no_first_time: "No, this is my first time",
    not_sure: "I'm not sure",
    of: "of",
    back: "Back",
    next: "Next",
    finish: "Finish",
    your_residency_deadline: "Your Residency Deadline",
    no_deadline_set: "No deadline set",
    incomplete_documents: "Incomplete Documents",
    documents_remaining: "documents remaining",
    document_checklist: "Document Checklist",
    save_changes: "Save Changes",
    ai_form: "AI Form",
    set_reminder: "Set Reminder",
    date: "Date",
    time: "Time",
    clear_reminder: "Clear Reminder",
    available_for_submission: "Available for submission",
    not_available_for_submission: "Not available for submission",
    deadline_expired: "Deadline has expired",

    // Document Options
    application_extension_form: "Application Extension Form",
    passport: "Passport",
    residence_card: "Residence Card",
    id_photo: "ID Photo (3x4 cm)",
    processing_fee: "Processing Fee",
    certificate_of_employment: "Certificate of Employment",
    company_registration_certificate: "Company Registration Certificate",
    company_financial_documents: "Company's Financial Documents",
    resident_tax_certificate: "Resident Tax Certificate",
    tax_payment_certificate: "Tax Payment Certificate",
    certificate_of_enrollment: "Certificate of Enrollment",
    academic_transcript: "Academic Transcript",
    bank_balance_certificate: "Bank Balance Certificate",
    scholarship_award_certificate: "Scholarship Award Certificate",
    certificate_of_remittance: "Certificate of Remittance",
    letter_of_guarantee: "Letter of Guarantee",
    marriage_certificate: "Marriage Certificate",
    birth_certificate: "Birth Certificate",
    bank_statement: "Bank Statement",
    family_register: "Family Register",
    resident_certificate: "Resident Certificate",

    // Conditional Label
    select_target_residency_type: "Select your target Residency type:",

    // Signup Page
    create_account: "Create Your Account",
    join_vizy_message: "Join Vizy and start your immigration journey",
    nickname: "Nickname",
    enter_nickname: "Enter your nickname",
    email: "Email",
    enter_email: "Enter your email",
    password: "Password",
    enter_password: "Enter your password",
    confirm_password: "Confirm Password",
    re_enter_password: "Re-enter your password",
    nickname_required: "Nickname is required",
    passwords_dont_match: "Passwords do not match",
    password_too_short: "Password must be at least 6 characters long",
    must_agree_terms: "You must agree to the Terms of Service",
    failed_create_account: "Failed to create an account",
    failed_google_signup: "Failed to sign up with Google",
    i_agree_to: "I agree to the",
    terms_of_service: "Terms of Service",
    creating_account: "Creating Account...",
    or: "or",
    continue_with_google: "Continue with Google",
    already_have_account: "Already have an account?",
    log_in: "Log in",
    welcome_to_vizy: "Welcome to Vizy",
    your_immigration_assistant: "Your immigration assistant",
    failed_to_login: "Failed to log in",
    failed_google_auth: "Failed to authenticate with Google",
    logging_in: "Logging in...",
    login: "Login",
    dont_have_account: "Don't have an account?",
    sign_up: "Sign up",
    redirecting: "Redirecting...",
    terms_agreement: "By using our service, you agree to the following terms:",
    service_description_title: "Service Description",
    service_description:
      "Vizy is an immigration assistant application designed to help users find immigration offices and photo booths in Japan.",
    user_responsibilities_title: "User Responsibilities",
    you_are_responsible_for: "You are responsible for:",
    providing_accurate_info: "Providing accurate information",
    maintaining_account_security: "Maintaining the security of your account",
    using_service_compliance: "Using the service in compliance with local laws",
    privacy: "Privacy",
    privacy_description:
      "We collect and process your data in accordance with our Privacy Policy. Your personal information is protected and will not be shared with third parties without your consent.",
    limitation_of_liability: "Limitation of Liability",
    liability_description:
      "Vizy provides information for reference purposes only. We are not responsible for any decisions made based on the information provided through our service.",
    changes_to_terms: "Changes to Terms",
    terms_changes_description:
      "We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.",
    last_updated: "Last updated",
    i_understand: "I Understand",
  },
  ja: {
    language: "言語",
    english: "English",
    japanese: "日本語",
    select_language: "言語を選択",
    home: "ホーム",
    settings: "設定",
    ai_chat: "AI チャット",
    maps: "マップ",
    account: "アカウント",
    logout: "サインアウト",
    cancel: "キャンセル",
    save: "保存",
    close: "閉じる",
    loading: "読み込み中...",
    error: "エラー",
    success: "成功",
    immigration_offices: "入管事務所",
    photo_booths: "証明写真機",
    reset_location: "リセット",
    your_location: "現在地",
    distance: "距離",
    directions: "ルート",
    call: "電話",
    ai_welcome:
      "こんにちは！私はビザ申請アシスタントです。ビザ延長フォームの記入を段階的にサポートします。何かご質問はありますか？",
    ai_loading: "入管事務所を読み込み中...",
    ai_loading_photo: "証明写真機を読み込み中...",
    ai_quick_tips: "以下のような質問をしていただけます：",
    full_name: "氏名",
    address: "住所",
    date_of_birth: "生年月日",
    documents: "書類",
    full_name_desc: "氏名を入力してください",
    address_desc: "住所を入力してください",
    date_of_birth_desc: "生年月日を入力してください",
    documents_desc: "お持ちの書類を選択してください",
    ask_anything_about_visa: "ビザについて何でも聞いてください",
    camera: "カメラ",
    image: "画像",
    welcome: "ようこそ",
    getting_started_message: "ビザ申請を始めましょう",
    get_started: "始める",
    manage_account: "アカウント設定を管理",
    customize_experience: "体験をカスタマイズ",
    get_help_support: "ヘルプとサポートを取得",
    privacy_security_settings: "プライバシーとセキュリティ設定",
    welcome_ai_assistant: "AI フォームアシスタントへようこそ！",
    what_i_can_help: "✨ お手伝いできること：",
    form_guidance: "フォームガイダンス",
    form_guidance_desc: "ビザ延長フォームの段階的なサポート",
    field_explanations: "フィールド説明",
    field_explanations_desc: "各フィールドの要件を理解",
    how_to_use: "💡 使用方法：",
    detailed_explanations: "詳細な説明と例を提供します",
    follow_up_questions: "追加の質問を自由にお聞きください",
    try_asking_me: "以下のような質問をしてみてください：",
    full_name_question: "氏名フィールドの記入方法は？",
    address_format_question: "住所の形式はどうすればいいですか？",
    visa_expiry_question: "ビザ有効期限フィールドについて教えてください",
    lets_start: "始めましょう！",
    vizy_ai_assistant: "Vizy AI",
    accessibility: "アクセシビリティ",
    help_support: "ヘルプとサポート",
    privacy_security: "プライバシーとセキュリティ",
    manage_profile_account: "プロフィールとアカウント設定を管理",
    choose_theme_colors: "お好みのテーマと色を選択",
    get_help_contact_support: "ヘルプを取得し、サポートに連絡",
    manage_privacy_security: "プライバシーとセキュリティ設定を管理",
    notification_test: "通知テスト",
    test_push_notifications: "プッシュ通知をテスト",
    welcome_back: "おかえりなさい！",
    whats_your_deadline: "期限はいつですか？",
    select_your_deadline: "期限を選択してください",
    whats_your_current_residency_type: "現在の在留資格は何ですか？",
    international_student_residency: "留学",
    work_residency: "就労",
    family_residency: "家族滞在",
    specified_skill_worker_residency: "特定技能",
    what_do_you_want_to_do: "何をしたいですか？",
    extend_current_residency: "現在の在留資格を延長する",
    change_to_different_residency_type: "別の在留資格に変更する",
    which_documents_do_you_have: "どの書類をお持ちですか？",
    have_you_applied_before: "以前に在留資格の申請をしたことがありますか？",
    yes_successfully: "はい、成功しました",
    yes_but_rejected: "はい、しかし拒否されました",
    no_first_time: "いいえ、初めてです",
    not_sure: "わかりません",
    of: "/",
    back: "戻る",
    next: "次へ",
    finish: "完了",
    your_residency_deadline: "在留期限",
    no_deadline_set: "期限が設定されていません",
    incomplete_documents: "未完了の書類",
    documents_remaining: "書類が残っています",
    document_checklist: "書類チェックリスト",
    save_changes: "変更を保存",
    ai_form: "AI フォーム",
    set_reminder: "リマインダーを設定",
    date: "日付",
    time: "時間",
    clear_reminder: "リマインダーをクリア",
    available_for_submission: "提出可能",
    not_available_for_submission: "提出不可",
    deadline_expired: "期限が切れています",

    // Document Options
    application_extension_form: "在留期間更新許可申請書",
    passport: "パスポート",
    residence_card: "在留カード",
    id_photo: "写真（3x4cm）",
    processing_fee: "手数料",
    certificate_of_employment: "在職証明書",
    company_registration_certificate: "会社登記簿謄本",
    company_financial_documents: "会社の財務書類",
    resident_tax_certificate: "住民税の課税証明書",
    tax_payment_certificate: "納税証明書",
    certificate_of_enrollment: "在学証明書",
    academic_transcript: "成績証明書",
    bank_balance_certificate: "残高証明書",
    scholarship_award_certificate: "奨学金給付証明書",
    certificate_of_remittance: "送金証明書",
    letter_of_guarantee: "身元保証書",
    marriage_certificate: "婚姻証明書",
    birth_certificate: "出生証明書",
    bank_statement: "銀行取引明細書",
    family_register: "戸籍謄本",
    resident_certificate: "住民票",

    // Conditional Label
    select_target_residency_type: "目標の在留資格を選択してください：",

    // Signup Page
    create_account: "アカウントを作成",
    join_vizy_message: "Vizyに参加して移民の旅を始めましょう",
    nickname: "ニックネーム",
    enter_nickname: "ニックネームを入力",
    email: "メールアドレス",
    enter_email: "メールアドレスを入力",
    password: "パスワード",
    enter_password: "パスワードを入力",
    confirm_password: "パスワード確認",
    re_enter_password: "パスワードを再入力",
    nickname_required: "ニックネームは必須です",
    passwords_dont_match: "パスワードが一致しません",
    password_too_short: "パスワードは6文字以上である必要があります",
    must_agree_terms: "利用規約に同意する必要があります",
    failed_create_account: "アカウントの作成に失敗しました",
    failed_google_signup: "Googleでのサインアップに失敗しました",
    i_agree_to: "私は以下に同意します",
    terms_of_service: "利用規約",
    creating_account: "アカウント作成中...",
    or: "または",
    continue_with_google: "Googleで続行",
    already_have_account: "すでにアカウントをお持ちですか？",
    log_in: "ログイン",
    welcome_to_vizy: "Vizyへようこそ",
    your_immigration_assistant: "あなたの移民アシスタント",
    failed_to_login: "ログインに失敗しました",
    failed_google_auth: "Googleでの認証に失敗しました",
    logging_in: "ログイン中...",
    login: "ログイン",
    dont_have_account: "アカウントをお持ちでないですか？",
    sign_up: "サインアップ",
    redirecting: "リダイレクト中...",
    terms_agreement:
      "当サービスをご利用いただくことで、以下の条件に同意したものとみなされます：",
    service_description_title: "サービス説明",
    service_description:
      "Vizyは、日本の入管事務所と証明写真機を見つけるのを支援する移民アシスタントアプリケーションです。",
    user_responsibilities_title: "ユーザーの責任",
    you_are_responsible_for: "以下の責任があります：",
    providing_accurate_info: "正確な情報の提供",
    maintaining_account_security: "アカウントのセキュリティ維持",
    using_service_compliance: "地域の法律に準拠したサービスの利用",
    privacy: "プライバシー",
    privacy_description:
      "当社はプライバシーポリシーに従ってデータを収集・処理します。個人情報は保護され、同意なしに第三者と共有されることはありません。",
    limitation_of_liability: "責任の制限",
    liability_description:
      "Vizyは参考情報のみを提供します。当サービスを通じて提供される情報に基づいて行われた決定について、当社は責任を負いません。",
    changes_to_terms: "利用規約の変更",
    terms_changes_description:
      "当社はいつでもこれらの条件を変更する権利を留保します。サービスの継続利用は、変更の承諾を構成します。",
    last_updated: "最終更新日",
    i_understand: "理解しました",
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");
  const { currentUser } = useAuth();

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("vizy-language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ja")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Load language from Firebase when user is authenticated
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid);
          if (profile?.language) {
            setLanguageState(profile.language);
            localStorage.setItem("vizy-language", profile.language);
          }
        } catch (error) {
          console.error("Error loading user language:", error);
        }
      }
    };

    loadUserLanguage();
  }, [currentUser]);

  // Save language to localStorage and Firebase when it changes
  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("vizy-language", newLanguage);

    // Save to Firebase if user is authenticated
    if (currentUser) {
      try {
        await updateUserLanguage(currentUser.uid, newLanguage);
      } catch (error) {
        console.error("Error saving language to Firebase:", error);
      }
    }
  };

  // Translation function
  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
