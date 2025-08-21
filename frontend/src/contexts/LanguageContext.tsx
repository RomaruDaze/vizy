import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getUserProfile,
  updateUserLanguage,
} from "../services/userProfileService";

type Language = "en" | "ja" | "id"; // Add Indonesian

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
    indonesian: "Indonesian",
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
    visa_expiry_date: "Visa Expiry Date",
    visa_expiry_desc: "Please enter your visa expiry date",
    documents_desc: "Please select the documents you have",
    start_new_conversation: "Start new conversation",
    conversation_history: "Conversation History",
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
    vizy_ai: "Vizy AI",
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
    documents_question:
      "Which documents do i need to apply for a visa extension?",

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

    // Settings translations
    themes: "Themes",
    choose_your_theme: "Choose Your Theme",
    select_color_theme_matches_style:
      "Select a color theme that matches your style and preferences",
    default: "Default",
    sunset: "Sunset",
    forest: "Forest",
    midnight: "Midnight",
    cherry: "Cherry",
    ocean: "Ocean",
    obsidian: "Obsidian",
    golden: "Golden",
    classic_purple_gradient: "Classic purple gradient",
    warm_orange_yellow: "Warm orange to yellow",
    fresh_green_gradient: "Fresh green gradient",
    dark_blue_tones: "Dark blue tones",
    vibrant_red_gradient: "Vibrant red gradient",
    deep_blue_waters: "Deep blue waters",
    dark_obsidian_tones: "Dark obsidian tones",
    pink_red_gradient: "Pink to red gradient",
    select: "Select",
    theme: "theme",

    // FAQ translations
    how_reset_password: "How do I reset my password?",
    reset_password_answer:
      "Go to Settings → Privacy & Security → Reset Password. Enter your email and we'll send you a password reset link.",
    how_delete_account: "How do I delete my account?",
    delete_account_answer:
      "Go to Settings → Privacy & Security → Delete Account. Please note this action cannot be undone.",
    how_change_theme: "How do I change my theme?",
    change_theme_answer:
      "Go to Settings → Accessibility → Theme. Choose from our available color themes.",
    how_find_immigration_offices: "How do I find immigration offices?",
    find_immigration_offices_answer:
      "Use the Locator feature in the bottom navigation. It will show you nearby immigration offices on the map.",
    how_find_photo_booths: "How do I find photo booths?",
    find_photo_booths_answer:
      "Use the Locator feature and toggle to 'Photo Booths' to see nearby photo booth locations.",
    how_contact_support: "How do I contact support?",
    contact_support_answer:
      "Go to Settings → Help & Support → Contact Support. Fill out the form and we'll get back to you.",
    is_data_secure: "Is my data secure?",
    data_secure_answer:
      "Yes, we use Firebase authentication and follow security best practices to protect your information.",
    can_use_offline: "Can I use the app offline?",
    offline_usage_answer:
      "Some features work offline, but you'll need internet for maps and real-time data.",
    how_update_profile: "How do I update my profile?",
    update_profile_answer:
      "Go to Settings → Account → Edit Profile to update your information.",
    incorrect_information: "What if I find incorrect information?",
    incorrect_information_answer:
      "Please contact support with the details and we'll verify and update the information.",
    all_questions: "All Questions",
    app_features: "App Features",
    locator_features: "Locator Features",
    search_faq: "Search FAQ...",
    collapse: "Collapse",
    expand: "Expand",
    no_faq_items_found: "No FAQ items found for your search.",
    try_different_keywords: "Try different keywords or browse all categories.",

    // Help & Support translations
    user_guide: "User Guide",
    learn_use_app_effectively: "Learn how to use the app effectively",
    find_answers_frequently_asked: "Find answers to frequently asked questions",
    get_touch_support_team: "Get in touch with our support team",
    faqs: "FAQs",
    title: "Title",
    brief_description_issue: "Brief description of your issue",
    problem_category: "Problem Category",
    select_category: "Select a category",
    technical_issue: "Technical Issue",
    account_problem: "Account Problem",
    feature_request: "Feature Request",
    bug_report: "Bug Report",
    general_inquiry: "General Inquiry",
    other: "Other",
    message: "Message",
    describe_issue_detail: "Please describe your issue in detail...",
    please_fill_all_fields: "Please fill in all fields",
    message_sent_successfully:
      "Message sent successfully! We'll get back to you soon.",
    failed_to_send_message: "Failed to send message. Please try again.",
    sending: "Sending...",
    send_message: "Send Message",

    // Privacy & Security translations
    reset_password: "Reset Password",
    send_password_reset_email_to: "Send password reset email to",
    delete_account: "Delete Account",
    permanently_delete_account_data: "Permanently delete your account and data",
    password_reset_email_sent: "Password reset email sent! Check your inbox.",
    no_account_found_email: "No account found with this email address.",
    invalid_email_format: "Invalid email address format.",
    too_many_requests: "Too many requests. Please try again later.",
    failed_send_reset_email: "Failed to send reset email",
    failed_delete_account: "Failed to delete account. Please try again.",
    send_password_reset_link_to: "We'll send a password reset link to",
    send_reset_email: "Send Reset Email",
    action_cannot_undone: "This action cannot be undone.",
    all_your_data_including: "All your data, including:",
    profile_information: "Profile information",
    saved_preferences: "Saved preferences",
    account_history: "Account history",
    all_app_data: "All app data",
    will_be_permanently_deleted: "will be permanently deleted.",
    reauthenticate: "Re-authenticate",
    security_reasons_enter_password:
      "For security reasons, please enter your password to confirm account deletion.",
    enter_your_password: "Enter your password",
    please_enter_password: "Please enter your password",
    incorrect_password: "Incorrect password. Please try again.",
    authentication_failed: "Authentication failed. Please try again.",
    reauthentication_failed: "Re-authentication failed",
    deleting: "Deleting...",
    confirm_deletion: "Confirm Deletion",

    // Reminder translations
    view_reminders: "View Reminders",
    reminders: "Reminders",
    no_reminders_set: "No reminders set",
    add_new_reminder: "Add New Reminder",
    reminder_title: "Reminder title",
    reminder_description: "Description (optional)",
    add_reminder: "Add Reminder",
  },
  id: {
    language: "Bahasa",
    english: "English",
    japanese: "Jepang",
    indonesian: "Indonesia",
    select_language: "Pilih Bahasa",
    home: "Beranda",
    settings: "Pengaturan",
    ai_chat: "Chat AI",
    maps: "Peta",
    account: "Akun",
    logout: "Keluar",
    cancel: "Batal",
    save: "Simpan",
    close: "Tutup",
    loading: "Memuat...",
    error: "Error",
    success: "Berhasil",
    immigration_offices: "Kantor Imigrasi",
    photo_booths: "Booth Foto",
    reset_location: "Reset",
    your_location: "Lokasi Anda",
    distance: "Jarak",
    directions: "Petunjuk Arah",
    call: "Telepon",
    ai_welcome:
      "Halo! Saya asisten AI untuk aplikasi visa Anda. Saya dapat membantu Anda mengisi formulir perpanjangan visa langkah demi langkah. Apa yang ingin Anda ketahui?",
    ai_loading: "Memuat kantor imigrasi...",
    ai_loading_photo: "Memuat booth foto...",
    ai_quick_tips:
      "Berikut beberapa pertanyaan cepat yang bisa Anda tanyakan kepada saya:",
    full_name: "Nama Lengkap",
    address: "Alamat",
    date_of_birth: "Tanggal Lahir",
    documents: "Dokumen",
    full_name_desc: "Silakan masukkan nama lengkap Anda",
    address_desc: "Silakan masukkan alamat Anda",
    date_of_birth_desc: "Silakan masukkan tanggal lahir Anda",
    documents_desc: "Silakan pilih dokumen yang Anda miliki",
    visa_expiry_date: "Tanggal Kedaluwarsa Visa",
    visa_expiry_desc: "Silakan masukkan tanggal kedaluwarsa visa Anda",
    start_new_conversation: "Mulai percakapan baru",
    conversation_history: "Riwayat Percakapan",
    ask_anything_about_visa: "Tanyakan apa saja tentang visa Anda",
    camera: "Kamera",
    image: "Gambar",
    welcome: "Selamat Datang",
    getting_started_message: "Mari mulai dengan aplikasi visa Anda",
    get_started: "Mulai",
    manage_account: "Kelola pengaturan akun Anda",
    customize_experience: "Sesuaikan pengalaman Anda",
    get_help_support: "Dapatkan bantuan dan dukungan",
    privacy_security_settings: "Pengaturan privasi dan keamanan",
    welcome_ai_assistant: "Selamat datang di Asisten Formulir AI!",
    what_i_can_help: "✨ Yang bisa saya bantu:",
    form_guidance: "Panduan Formulir",
    form_guidance_desc:
      "Dapatkan bantuan langkah demi langkah dengan formulir perpanjangan visa",
    field_explanations: "Penjelasan Bidang",
    field_explanations_desc: "Pahami apa yang diperlukan setiap bidang",
    how_to_use: "💡 Cara menggunakan:",
    detailed_explanations:
      "Saya akan memberikan penjelasan dan contoh yang detail",
    follow_up_questions: "Jangan ragu untuk mengajukan pertanyaan lanjutan",
    try_asking_me: "Coba tanyakan saya:",
    full_name_question: "Bagaimana cara mengisi bidang nama lengkap?",
    address_format_question:
      "Format apa yang harus saya gunakan untuk alamat saya?",
    visa_expiry_question: "Bantu saya dengan bidang tanggal kedaluwarsa visa",
    lets_start: "Mari mulai!",
    vizy_ai: "Vizy AI",
    accessibility: "Aksesibilitas",
    help_support: "Bantuan & Dukungan",
    privacy_security: "Privasi & Keamanan",
    manage_profile_account: "Kelola profil dan pengaturan akun Anda",
    choose_theme_colors: "Pilih tema dan warna yang Anda sukai",
    get_help_contact_support: "Dapatkan bantuan dan hubungi dukungan",
    manage_privacy_security: "Kelola pengaturan privasi dan keamanan",
    notification_test: "Tes Notifikasi",
    test_push_notifications: "Tes notifikasi push",
    welcome_back: "Selamat datang kembali!",
    whats_your_deadline: "Apa batas waktu Anda?",
    select_your_deadline: "Pilih batas waktu Anda",
    whats_your_current_residency_type: "Apa jenis izin tinggal Anda saat ini?",
    international_student_residency: "Izin Tinggal Pelajar Internasional",
    work_residency: "Izin Tinggal Kerja",
    family_residency: "Izin Tinggal Keluarga",
    specified_skill_worker_residency:
      "Izin Tinggal Pekerja Keterampilan Tertentu",
    what_do_you_want_to_do: "Apa yang ingin Anda lakukan?",
    extend_current_residency: "Perpanjang izin tinggal saya saat ini",
    change_to_different_residency_type:
      "Ubah ke jenis izin tinggal yang berbeda",
    which_documents_do_you_have: "Dokumen apa yang sudah Anda miliki?",
    have_you_applied_before:
      "Apakah Anda pernah mengajukan izin tinggal sebelumnya?",
    yes_successfully: "Ya, berhasil",
    yes_but_rejected: "Ya, tetapi ditolak",
    no_first_time: "Tidak, ini pertama kali saya",
    not_sure: "Saya tidak yakin",
    of: "dari",
    back: "Kembali",
    next: "Selanjutnya",
    finish: "Selesai",
    your_residency_deadline: "Batas Waktu Izin Tinggal Anda",
    no_deadline_set: "Tidak ada batas waktu yang ditetapkan",
    incomplete_documents: "Dokumen Tidak Lengkap",
    documents_remaining: "dokumen tersisa",
    document_checklist: "Daftar Periksa Dokumen",
    save_changes: "Simpan Perubahan",
    ai_form: "Formulir AI",
    set_reminder: "Atur Pengingat",
    date: "Tanggal",
    time: "Waktu",
    clear_reminder: "Hapus Pengingat",
    available_for_submission: "Tersedia untuk pengajuan",
    not_available_for_submission: "Tidak tersedia untuk pengajuan",
    deadline_expired: "Batas waktu telah berakhir",
    documents_question:
      "Dokumen apa yang saya butuhkan untuk perpanjangan visa?",

    // Document Options
    application_extension_form: "Formulir Perpanjangan Permohonan",
    passport: "Paspor",
    residence_card: "Kartu Izin Tinggal",
    id_photo: "Foto (3x4 cm)",
    processing_fee: "Biaya Pemrosesan",
    certificate_of_employment: "Sertifikat Pekerjaan",
    company_registration_certificate: "Sertifikat Pendaftaran Perusahaan",
    company_financial_documents: "Dokumen Keuangan Perusahaan",
    resident_tax_certificate: "Sertifikat Pajak Penduduk",
    tax_payment_certificate: "Sertifikat Pembayaran Pajak",
    certificate_of_enrollment: "Sertifikat Pendaftaran",
    academic_transcript: "Transkrip Akademik",
    bank_balance_certificate: "Sertifikat Saldo Bank",
    scholarship_award_certificate: "Sertifikat Beasiswa",
    certificate_of_remittance: "Sertifikat Transfer",
    letter_of_guarantee: "Surat Jaminan",
    marriage_certificate: "Sertifikat Pernikahan",
    birth_certificate: "Sertifikat Kelahiran",
    bank_statement: "Laporan Bank",
    family_register: "Daftar Keluarga",
    resident_certificate: "Sertifikat Penduduk",

    // Conditional Label
    select_target_residency_type: "Pilih jenis izin tinggal target Anda:",

    // Signup Page
    create_account: "Buat Akun Anda",
    join_vizy_message:
      "Bergabung dengan Vizy dan mulai perjalanan imigrasi Anda",
    nickname: "Nama Panggilan",
    enter_nickname: "Masukkan nama panggilan Anda",
    email: "Email",
    enter_email: "Masukkan email Anda",
    password: "Password",
    enter_password: "Masukkan password Anda",
    confirm_password: "Konfirmasi Password",
    re_enter_password: "Masukkan ulang password Anda",
    nickname_required: "Nama panggilan diperlukan",
    passwords_dont_match: "Password tidak cocok",
    password_too_short: "Password harus minimal 6 karakter",
    must_agree_terms: "Anda harus menyetujui Ketentuan Layanan",
    failed_create_account: "Gagal membuat akun",
    failed_google_signup: "Gagal mendaftar dengan Google",
    i_agree_to: "Saya setuju dengan",
    terms_of_service: "Ketentuan Layanan",
    creating_account: "Membuat Akun...",
    or: "atau",
    continue_with_google: "Lanjutkan dengan Google",
    already_have_account: "Sudah punya akun?",
    log_in: "Masuk",
    welcome_to_vizy: "Selamat datang di Vizy",
    your_immigration_assistant: "Asisten imigrasi Anda",
    failed_to_login: "Gagal masuk",
    failed_google_auth: "Gagal autentikasi dengan Google",
    logging_in: "Sedang masuk...",
    login: "Masuk",
    dont_have_account: "Tidak punya akun?",
    sign_up: "Daftar",
    redirecting: "Mengalihkan...",
    terms_agreement:
      "Dengan menggunakan layanan kami, Anda setuju dengan ketentuan berikut:",
    service_description_title: "Deskripsi Layanan",
    service_description:
      "Vizy adalah aplikasi asisten imigrasi yang dirancang untuk membantu pengguna menemukan kantor imigrasi dan booth foto di Jepang.",
    user_responsibilities_title: "Tanggung Jawab Pengguna",
    you_are_responsible_for: "Anda bertanggung jawab untuk:",
    providing_accurate_info: "Memberikan informasi yang akurat",
    maintaining_account_security: "Mempertahankan keamanan akun Anda",
    using_service_compliance: "Menggunakan layanan sesuai dengan hukum lokal",
    privacy: "Privasi",
    privacy_description:
      "Kami mengumpulkan dan memproses data Anda sesuai dengan Kebijakan Privasi kami. Informasi pribadi Anda dilindungi dan tidak akan dibagikan dengan pihak ketiga tanpa persetujuan Anda.",
    limitation_of_liability: "Pembatasan Tanggung Jawab",
    liability_description:
      "Vizy menyediakan informasi hanya untuk tujuan referensi. Kami tidak bertanggung jawab atas keputusan apa pun yang dibuat berdasarkan informasi yang disediakan melalui layanan kami.",
    changes_to_terms: "Perubahan Ketentuan",
    terms_changes_description:
      "Kami berhak untuk memodifikasi ketentuan ini kapan saja. Penggunaan layanan yang berkelanjutan merupakan penerimaan terhadap perubahan apa pun.",
    last_updated: "Terakhir diperbarui",
    i_understand: "Saya Mengerti",

    // Settings translations
    themes: "Tema",
    choose_your_theme: "Pilih Tema Anda",
    select_color_theme_matches_style:
      "Pilih tema warna yang sesuai dengan gaya dan preferensi Anda",
    default: "Default",
    sunset: "Sunset",
    forest: "Hutan",
    midnight: "Midnight",
    cherry: "Cherry",
    ocean: "Ocean",
    obsidian: "Obsidian",
    golden: "Gold",
    classic_purple_gradient: "Gradien ungu klasik",
    warm_orange_yellow: "Oranye hangat ke kuning",
    fresh_green_gradient: "Gradien hijau segar",
    dark_blue_tones: "Nada biru gelap",
    vibrant_red_gradient: "Gradien merah cerah",
    deep_blue_waters: "Perairan biru dalam",
    dark_obsidian_tones: "Nada obsidian gelap",
    pink_red_gradient: "Gradien merah muda ke merah",
    select: "Pilih",
    theme: "tema",

    // FAQ translations
    how_reset_password: "Bagaimana cara mereset password saya?",
    reset_password_answer:
      "Pergi ke Pengaturan → Privasi & Keamanan → Reset Password. Masukkan email Anda dan kami akan mengirimkan link reset password.",
    how_delete_account: "Bagaimana cara menghapus akun saya?",
    delete_account_answer:
      "Pergi ke Pengaturan → Privasi & Keamanan → Hapus Akun. Harap diperhatikan bahwa tindakan ini tidak dapat dibatalkan.",
    how_change_theme: "Bagaimana cara mengubah tema saya?",
    change_theme_answer:
      "Pergi ke Pengaturan → Aksesibilitas → Tema. Pilih dari tema warna yang tersedia.",
    how_find_immigration_offices: "Bagaimana cara menemukan kantor imigrasi?",
    find_immigration_offices_answer:
      "Gunakan fitur Locator di navigasi bawah. Ini akan menunjukkan kantor imigrasi terdekat di peta.",
    how_find_photo_booths: "Bagaimana cara menemukan booth foto?",
    find_photo_booths_answer:
      "Gunakan fitur Locator dan beralih ke 'Booth Foto' untuk melihat lokasi booth foto terdekat.",
    how_contact_support: "Bagaimana cara menghubungi dukungan?",
    contact_support_answer:
      "Pergi ke Pengaturan → Bantuan & Dukungan → Hubungi Dukungan. Isi formulir dan kami akan menghubungi Anda kembali.",
    is_data_secure: "Apakah data saya aman?",
    data_secure_answer:
      "Ya, kami menggunakan autentikasi Firebase dan mengikuti praktik keamanan terbaik untuk melindungi informasi Anda.",
    can_use_offline: "Bisakah saya menggunakan aplikasi offline?",
    offline_usage_answer:
      "Beberapa fitur berfungsi offline, tetapi Anda memerlukan internet untuk peta dan data real-time.",
    how_update_profile: "Bagaimana cara memperbarui profil saya?",
    update_profile_answer:
      "Pergi ke Pengaturan → Akun → Edit Profil untuk memperbarui informasi Anda.",
    incorrect_information:
      "Bagaimana jika saya menemukan informasi yang salah?",
    incorrect_information_answer:
      "Silakan hubungi dukungan dengan detailnya dan kami akan memverifikasi dan memperbarui informasinya.",
    all_questions: "Semua Pertanyaan",
    app_features: "Fitur Aplikasi",
    locator_features: "Fitur Locator",
    search_faq: "Cari FAQ...",
    collapse: "Ciutkan",
    expand: "Perluas",
    no_faq_items_found:
      "Tidak ada item FAQ yang ditemukan untuk pencarian Anda.",
    try_different_keywords:
      "Coba kata kunci yang berbeda atau jelajahi semua kategori.",

    // Help & Support translations
    user_guide: "Panduan Pengguna",
    learn_use_app_effectively:
      "Pelajari cara menggunakan aplikasi secara efektif",
    find_answers_frequently_asked:
      "Temukan jawaban untuk pertanyaan yang sering diajukan",
    get_touch_support_team: "Hubungi tim dukungan kami",
    faqs: "FAQ",
    title: "Judul",
    brief_description_issue: "Deskripsi singkat masalah Anda",
    problem_category: "Kategori Masalah",
    select_category: "Pilih kategori",
    technical_issue: "Masalah Teknis",
    account_problem: "Masalah Akun",
    feature_request: "Permintaan Fitur",
    bug_report: "Laporan Bug",
    general_inquiry: "Pertanyaan Umum",
    other: "Lainnya",
    message: "Pesan",
    describe_issue_detail: "Silakan jelaskan masalah Anda secara detail...",
    please_fill_all_fields: "Silakan isi semua bidang",
    message_sent_successfully:
      "Pesan berhasil dikirim! Kami akan segera menghubungi Anda kembali.",
    failed_to_send_message: "Gagal mengirim pesan. Silakan coba lagi.",
    sending: "Mengirim...",
    send_message: "Kirim Pesan",

    // Privacy & Security translations
    reset_password: "Reset Password",
    send_password_reset_email_to: "Kirim email reset password ke",
    delete_account: "Hapus Akun",
    permanently_delete_account_data: "Hapus akun dan data Anda secara permanen",
    password_reset_email_sent:
      "Email reset password telah dikirim! Periksa kotak masuk Anda.",
    no_account_found_email:
      "Tidak ada akun yang ditemukan dengan alamat email ini.",
    invalid_email_format: "Format alamat email tidak valid.",
    too_many_requests: "Terlalu banyak permintaan. Silakan coba lagi nanti.",
    failed_send_reset_email: "Gagal mengirim email reset",
    failed_delete_account: "Gagal menghapus akun. Silakan coba lagi.",
    send_password_reset_link_to: "Kami akan mengirimkan link reset password ke",
    send_reset_email: "Kirim Email Reset",
    action_cannot_undone: "Tindakan ini tidak dapat dibatalkan.",
    all_your_data_including: "Semua data Anda, termasuk:",
    profile_information: "Informasi profil",
    saved_preferences: "Preferensi yang disimpan",
    account_history: "Riwayat akun",
    all_app_data: "Semua data aplikasi",
    will_be_permanently_deleted: "akan dihapus secara permanen.",
    reauthenticate: "Re-autentikasi",
    security_reasons_enter_password:
      "Untuk alasan keamanan, silakan masukkan password Anda untuk mengkonfirmasi penghapusan akun.",
    enter_your_password: "Masukkan password Anda",
    please_enter_password: "Silakan masukkan password Anda",
    incorrect_password: "Password salah. Silakan coba lagi.",
    authentication_failed: "Autentikasi gagal. Silakan coba lagi.",
    reauthentication_failed: "Re-autentikasi gagal",
    deleting: "Menghapus...",
    confirm_deletion: "Konfirmasi Penghapusan",
  },
  ja: {
    // Basic translations
    language: "言語",
    english: "英語",
    indonesian: "インドネシア語",
    japanese: "日本語",
    select_language: "言語を選択",
    home: "ホーム",
    settings: "設定",
    ai_chat: "AI Chat",
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
    visa_expiry_date: "ビザの有効期限",
    visa_expiry_desc: "ビザの有効期限を入力してください",
    start_new_conversation: "新しい会話を開始",
    conversation_history: "会話履歴",
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
    vizy_ai: "Vizy AI",
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
    documents_question: "ビザ延長の申請に必要な書類は何ですか？",

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

    // Settings translations
    themes: "テーマ",
    choose_your_theme: "テーマを選択",
    select_color_theme_matches_style:
      "あなたのスタイルと好みに合ったカラーテーマを選択してください",
    default: "Default",
    sunset: "Sunset",
    forest: "Forest",
    midnight: "Midnight",
    cherry: "Cherry",
    ocean: "Ocean",
    obsidian: "Obsidian",
    golden: "Gold",
    classic_purple_gradient: "クラシックな紫のグラデーション",
    warm_orange_yellow: "暖かいオレンジから黄色",
    fresh_green_gradient: "新鮮な緑のグラデーション",
    dark_blue_tones: "ダークブルーのトーン",
    vibrant_red_gradient: "鮮やかな赤のグラデーション",
    deep_blue_waters: "深い青い海",
    dark_obsidian_tones: "ダークオブシディアンのトーン",
    pink_red_gradient: "ピンクから赤のグラデーション",
    select: "選択",
    theme: "テーマ",

    // FAQ translations
    how_reset_password: "パスワードをリセットするには？",
    reset_password_answer:
      "設定 → プライバシーとセキュリティ → パスワードリセットに移動してください。メールアドレスを入力すると、パスワードリセットリンクを送信します。",
    how_delete_account: "アカウントを削除するには？",
    delete_account_answer:
      "設定 → プライバシーとセキュリティ → アカウント削除に移動してください。この操作は取り消せません。",
    how_change_theme: "テーマを変更するには？",
    change_theme_answer:
      "設定 → アクセシビリティ → テーマに移動してください。利用可能なカラーテーマから選択してください。",
    how_find_immigration_offices: "入管事務所を見つけるには？",
    find_immigration_offices_answer:
      "下部ナビゲーションのロケーター機能を使用してください。地図上で近くの入管事務所が表示されます。",
    how_find_photo_booths: "証明写真機を見つけるには？",
    find_photo_booths_answer:
      "ロケーター機能を使用し、「証明写真機」に切り替えて近くの証明写真機の場所を確認してください。",
    how_contact_support: "サポートに連絡するには？",
    contact_support_answer:
      "設定 → ヘルプとサポート → サポートに連絡に移動してください。フォームに記入すると、お返事いたします。",
    is_data_secure: "データは安全ですか？",
    data_secure_answer:
      "はい、Firebase認証を使用し、セキュリティのベストプラクティスに従って情報を保護しています。",
    can_use_offline: "オフラインで使用できますか？",
    offline_usage_answer:
      "一部の機能はオフラインで動作しますが、地図とリアルタイムデータにはインターネットが必要です。",
    how_update_profile: "プロフィールを更新するには？",
    update_profile_answer:
      "設定 → アカウント → プロフィール編集に移動して情報を更新してください。",
    incorrect_information: "間違った情報を見つけた場合は？",
    incorrect_information_answer:
      "詳細をサポートに連絡してください。確認して情報を更新いたします。",
    all_questions: "すべての質問",
    app_features: "アプリ機能",
    locator_features: "ロケーター機能",
    search_faq: "FAQを検索...",
    collapse: "折りたたむ",
    expand: "展開",
    no_faq_items_found: "検索に一致するFAQ項目が見つかりません。",
    try_different_keywords:
      "異なるキーワードを試すか、すべてのカテゴリを閲覧してください。",

    // Help & Support translations
    user_guide: "ユーザーガイド",
    learn_use_app_effectively: "アプリを効果的に使用する方法を学ぶ",
    find_answers_frequently_asked: "よくある質問の答えを見つける",
    get_touch_support_team: "サポートチームに連絡する",
    faqs: "よくある質問",
    title: "タイトル",
    brief_description_issue: "問題の簡単な説明",
    problem_category: "問題のカテゴリ",
    select_category: "カテゴリを選択",
    technical_issue: "技術的な問題",
    account_problem: "アカウントの問題",
    feature_request: "機能リクエスト",
    bug_report: "バグ報告",
    general_inquiry: "一般的な問い合わせ",
    other: "その他",
    message: "メッセージ",
    describe_issue_detail: "問題を詳しく説明してください...",
    please_fill_all_fields: "すべての項目を入力してください",
    message_sent_successfully:
      "メッセージが正常に送信されました！すぐにご連絡いたします。",
    failed_to_send_message:
      "メッセージの送信に失敗しました。もう一度お試しください。",
    sending: "送信中...",
    send_message: "メッセージを送信",

    // Privacy & Security translations
    reset_password: "パスワードをリセット",
    send_password_reset_email_to: "パスワードリセットメールを送信先",
    delete_account: "アカウントを削除",
    permanently_delete_account_data: "アカウントとデータを完全に削除",
    password_reset_email_sent:
      "パスワードリセットメールが送信されました！受信トレイを確認してください。",
    no_account_found_email: "このメールアドレスでアカウントが見つかりません。",
    invalid_email_format: "無効なメールアドレス形式です。",
    too_many_requests: "リクエストが多すぎます。後でもう一度お試しください。",
    failed_send_reset_email: "リセットメールの送信に失敗しました",
    failed_delete_account:
      "アカウントの削除に失敗しました。もう一度お試しください。",
    send_password_reset_link_to: "パスワードリセットリンクを送信先",
    send_reset_email: "リセットメールを送信",
    action_cannot_undone: "この操作は取り消せません。",
    all_your_data_including: "すべてのデータ、以下を含む：",
    profile_information: "プロフィール情報",
    saved_preferences: "保存された設定",
    account_history: "アカウント履歴",
    all_app_data: "すべてのアプリデータ",
    will_be_permanently_deleted: "が完全に削除されます。",
    reauthenticate: "再認証",
    security_reasons_enter_password:
      "セキュリティ上の理由により、アカウント削除を確認するためにパスワードを入力してください。",
    enter_your_password: "パスワードを入力",
    please_enter_password: "パスワードを入力してください",
    incorrect_password:
      "パスワードが正しくありません。もう一度お試しください。",
    authentication_failed: "認証に失敗しました。もう一度お試しください。",
    reauthentication_failed: "再認証に失敗しました",
    deleting: "削除中...",
    confirm_deletion: "削除を確認",
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
    if (
      savedLanguage &&
      (savedLanguage === "en" ||
        savedLanguage === "ja" ||
        savedLanguage === "id")
    ) {
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
