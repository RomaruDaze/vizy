import React, { createContext, useContext, useEffect, useState } from "react";

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
    ai_full_name: "Full Name",
    ai_address: "Address",
    ai_date_of_birth: "Date of Birth",
    ai_documents: "Documents",
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
    vizy_ai_assistant: "Vizy AI Assistant",
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
    ai_full_name: "氏名",
    ai_address: "住所",
    ai_date_of_birth: "生年月日",
    ai_documents: "書類",
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
    vizy_ai_assistant: "Vizy AI アシスタント",
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
  },
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("vizy-language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ja")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("vizy-language", language);
  }, [language]);

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
