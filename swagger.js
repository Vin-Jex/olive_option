require("dotenv").config();
const swaggerAutogen = require("swagger-autogen")();

const host =
  process.env.NODE_ENV === "developmentL"
    ? `localhost:${process.env.PORT}`
    : "api-oliveoption.up.railway.app";

const schemes =
  process.env.NODE_ENV === "developmentL" ? ["http", "https"] : ["https"];

const doc = {
  swagger: "2.0",
  info: {
    title: "Olive Option API",
    description:
      "Welcome to the Olive Option API documentation! This API serves as the backbone for the Olive Option platform, enabling seamless interactions with our services and functionalities. Through this API, developers can manage users, process transactions, and access a wide range of options-related data, making it an essential tool for building applications that integrate with our platform. \n\nKey features include:\n- **User Management**: Create, read, update, and delete user accounts with ease.\n- **Transaction Processing**: Handle financial transactions securely and efficiently.\n- **Options Data Access**: Retrieve real-time information on various options available on our platform.\n\nTo get started, explore the various endpoints available in this documentation. You can also [download the Swagger JSON](https://api-oliveoption.up.railway.app/swagger.json) for a comprehensive view of the API structure. Our API is designed with ease of use and flexibility in mind, providing you with the necessary tools to integrate and enhance your applications. Happy coding!",
    version: "1.0.0",
    contact: {
      name: "Support Team",
      url: "https://support.oliveoption.com",
      email: "support@oliveoption.com",
    },
  },
  host: host,
  basePath: "/",
  schemes: schemes,
  paths: {},
  tags: [
    {
      name: "User",
    },
    {
      name: "Alert",
    },
    {
      name: "Password Reset",
    },
    {
      name: "Verify Email",
    },
    {
      name: "Options",
    },
    {
      name: "Wallet",
    },
    {
      name: "Trades",
    },
    {
      name: "Staff:Auth",
    },
    {
      name: "Staff:User",
    },
    {
      name: "Staff:Trade",
    },
    {
      name: "Staff:Finance",
    },
    {
      name: "Staff:Faq",
    },
    {
      name: "Staff:Content",
    },
    {
      name: "Staff:Promotion",
    },
    {
      name: "Staff:Setting",
    },
    {
      name: "Affiliate Users",
    },
    {
      name: "Affiliate",
    },
    {
      name: "Affiliate Admin Management",
    },
    {
      name: "Affiliate - Promo Code",
    },
    {
      name: "Affiliate - Links",
    },
    {
      name: "Affiliate - Link Types",
    },
    {
      name: "Affiliate - Program Types",
    },
    {
      name: "Affiliate - Telegram Links",
    },
    {
      name: "Affiliate Tracking Services - Link Clicks",
    },
    {
      name: "Affiliate Tracking Services - User Activities",
    },
    {
      name: "Affiliate - Support",
    },
  ],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description:
        "JWT Authorization header using the Bearer scheme. Example: `Authorization: Bearer {accessToken=<token>;refreshToken=<token>}`",
    },
  },
  security: [
    {
      Bearer: [],
    },
  ],
  definitions: {
    RequestSuccessful: {
      ok: true,
      message: "Request Successful",
      status: 200,
    },
    InternalServerError: {
      ok: false,
      message: "Sorry an internal server error occured.",
      status: 500,
    },
    BadRequest: {
      ok: false,
      message: "string",
      status: 400,
    },
    Unauthorized: {
      ok: false,
      message: "Unauthorized request",
      status: 401,
    },
    NotFound: {
      ok: false,
      message: "Information not found",
      status: 404,
    },
    Forbidden: {
      ok: false,
      message: "Access forbidden",
      status: 403,
    },
    // User Schemas
    UserSignupOrLoginPayload: {
      email: "string",
      password: "string",
    },
    UserLoginResponse: {
      ok: true,
      message: "Request Successful",
      status: 200,
      body: {
        tokens: { auth: "string", refresh: "token" },
      },
    },
    ResetPasswordOtpPayload: {
      email: "string",
    },
    ResetPasswordVerifyPayload: {
      email: "string",
      otp: "string",
    },
    ResetPasswordVerifyResponse: {
      ok: true,
      message: "Request Successful",
      status: 200,
      body: { token: "string" },
    },
    ResetPasswordPayload: {
      token: "string",
      password: "string",
    },
    EmailVerifyPayload: {
      otp: "string",
    },
    MeResponse: {
      ok: true,
      message: "Request Successful",
      status: 200,
      body: {
        user: {
          id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          first_name: "Femi",
          last_name: "Fatokun",
          email: "fatokunfemi03@gmail.com",
          phone: "+2349047238648",
          date_of_birth: "2000-08-13T00:00:00.000Z",
          country: "NG",
          livemode: false,
          is_disabled: false,
          is_email_verified: false,
          last_login_at: null,
          created_at: "2024-08-12T14:31:20.545Z",
          updated_at: "2024-08-13T08:44:04.372Z",
          role: "user",
          deleted_at: null,
          settings: {
            id: 1,
            language: "English",
            enable_sound: true,
            email_notification: true,
            created_at: null,
            updated_at: "2024-08-13T08:57:52.603Z",
            deleted_at: null,
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          },
        },
      },
    },
    UpdateUserPayload: {
      first_name: "string",
      last_name: "string",
      date_of_birth: "Date",
      country: "string",
      phone: "string",
    },
    UpdateUserSettingsPayload: {
      language: "string",
      enable_sound: "boolean",
      email_notification: "boolean",
    },
    UpdatePasswordPayload: {
      old_password: "string",
      new_password: "string",
    },
    GetWalletResponse: {
      ok: true,
      status: 200,
      message: "Request Successful",
      body: {
        wallet: {
          balance: "0.00",
          id: 1,
          user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          livemode: false,
          updated_at: "2024-08-28T10:54:43.814Z",
          created_at: "2024-08-28T10:54:43.814Z",
        },
      },
    },
    TradeHistoryPayload: {
      limit: "number",
      offset: "number",
      period: "number",
      pending: "boolean",
      symbol: "string",
    },
    SingleIdPayload: {
      id: "string",
    },
    TradeResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        trade: {
          id: 1,
          symbol: "A",
          start_time: "2024-09-04T16:46:36.069Z",
          expiry_time: "2024-09-04T16:47:00.000Z",
          amount: "1000.00",
          prediction: "higher",
          prediction_correct: null,
          status: "waiting",
          initial_value: "39510428039.21",
          completed_value: null,
          livemode: false,
          created_at: "2024-09-04T16:46:37.234Z",
          updated_at: "2024-09-04T16:46:37.234Z",
          user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          transaction_id: 1,
        },
      },
    },
    ListTransactionsPayload: {
      limit: "number",
      offset: "number",
      type: "transaction_type",
      status: "transaction_statuses",
      date_from: "Date",
      date_to: "Date",
    },
    ListTransactionsResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        limit: 20,
        offset: 0,
        total_count: 2,
        total_pages: 1,
        transactions: [
          {
            id: 19,
            ref: "1725633120000-16-5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            amount: "1900.00",
            type: "credit",
            status: "completed",
            metadata: '{"order_id":16}',
            livemode: false,
            desc: "Reward for correct prediction.",
            created_at: "2024-09-06T14:33:42.458Z",
            updated_at: "2024-09-06T14:33:42.458Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            wallet_id: 1,
          },
          {
            id: 15,
            ref: "1725632897484-1725632940000-15-5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            amount: "1900.00",
            type: "credit",
            status: "completed",
            metadata: '{"order_id":13}',
            livemode: false,
            desc: "Reward for correct prediction.",
            created_at: "2024-09-04T17:56:01.168Z",
            updated_at: "2024-09-06T14:28:18.653Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            wallet_id: 1,
          },
        ],
      },
    },
    GetTransactionResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        transaction: {
          id: 1,
          ref: "1725468396069-1725468420000-1-5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          amount: "1000.00",
          type: "debit",
          status: "completed",
          metadata: "{}",
          livemode: false,
          desc: "Payment for options contract.",
          created_at: "2024-09-04T16:46:37.219Z",
          updated_at: "2024-09-04T16:46:37.239Z",
          user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          wallet_id: null,
          order: {
            id: 1,
            symbol: "A",
            start_time: "2024-09-04T16:46:36.069Z",
            expiry_time: "2024-09-04T16:47:00.000Z",
            amount: "1000.00",
            prediction: "higher",
            prediction_correct: null,
            status: "waiting",
            initial_value: "39510428039.21",
            completed_value: null,
            livemode: false,
            created_at: "2024-09-04T16:46:37.234Z",
            updated_at: "2024-09-04T16:46:37.234Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            transaction_id: 1,
          },
        },
      },
    },
    TradeHistoryResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        limit: 20,
        offset: 0,
        total_count: 16,
        total_pages: 1,
        trades: [
          {
            id: 16,
            symbol: "A",
            start_time: "2024-09-06T14:31:24.246Z",
            expiry_time: "2024-09-06T14:32:00.000Z",
            amount: "1000.00",
            prediction: "higher",
            prediction_correct: true,
            status: "evaluated",
            initial_value: "39754656559.56",
            completed_value: "39754656559.56",
            livemode: false,
            created_at: "2024-09-06T14:31:25.576Z",
            updated_at: "2024-09-06T14:33:42.468Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            transaction_id: 18,
          },
        ],
      },
    },
    ListStaffsResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 2,
        total_pages: 1,
        staffs: [
          {
            id: 2,
            full_name: "Finance Staff",
            email: "finance@oliveoption.com",
            pfp_url: null,
            is_admin: false,
            is_active: true,
            created_at: "2024-10-02T09:30:16.778Z",
            last_login: null,
            updated_at: "2024-10-02T09:30:16.778Z",
          },
        ],
      },
      message: "Request successful.",
    },
    ListStaffActivitiesResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 0,
        total_pages: 0,
        activities: [],
      },
      message: "Request successful.",
    },
    GetStaffResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        staff: {
          id: 2,
          full_name: "Finance Staff",
          email: "finance@oliveoption.com",
          pfp_url: null,
          is_admin: false,
          is_active: true,
          created_at: "2024-10-02T09:30:16.778Z",
          last_login: null,
          updated_at: "2024-10-02T09:30:16.778Z",
          permissions: {
            id: 2,
            user: false,
            financial: true,
            affiliate: false,
            trade: false,
            promotional: false,
            created_at: "2024-10-02T09:30:16.784Z",
            updated_at: "2024-10-02T09:30:16.784Z",
            staff_id: 2,
          },
        },
      },
    },
    CreateStaffPayload: {
      full_name: "Finance Staff",
      email: "finance@oliveoption.com",
      is_admin: false,
      password: "12345678",
      permissions: {
        financial: true,
        user: false,
        affiliate: false,
        trade: false,
        promotional: false,
      },
    },
    ListUsersResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 2,
        total_pages: 1,
        users: [
          {
            id: "a3a18a4e-6b27-43ff-9efa-81414c581f62",
            first_name: null,
            last_name: null,
            email: "curious52019@gmail.com",
            phone: null,
            pfp_url: null,
            date_of_birth: null,
            country: null,
            livemode: false,
            is_disabled: false,
            is_email_verified: false,
            is_phone_verified: false,
            last_login_at: null,
            created_at: "2024-08-23T16:09:24.981Z",
            updated_at: "2024-08-23T16:09:24.981Z",
            deleted_at: null,
          },
          {
            id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            first_name: "Femi",
            last_name: "Fatokun",
            email: "fatokunfemi03@gmail.com",
            phone: "+2349047238648",
            pfp_url:
              "https://oliveoption.blob.core.windows.net/default/profile_pics/profile_pic_1723724632731_331371914.png",
            date_of_birth: "2000-08-13T00:00:00.000Z",
            country: "NG",
            livemode: false,
            is_disabled: false,
            is_email_verified: true,
            is_phone_verified: false,
            last_login_at: "2024-09-29T09:31:58.687Z",
            created_at: "2024-08-12T14:31:20.545Z",
            updated_at: "2024-09-29T09:31:58.688Z",
            deleted_at: null,
          },
        ],
      },
      message: "Request successful.",
    },
    GetUserResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        user: {
          id: "a3a18a4e-6b27-43ff-9efa-81414c581f62",
          first_name: null,
          last_name: null,
          email: "curious52019@gmail.com",
          phone: null,
          pfp_url: null,
          date_of_birth: null,
          country: null,
          livemode: false,
          is_disabled: false,
          is_email_verified: false,
          is_phone_verified: false,
          password_hash:
            "$2a$10$gc6ASCG1Nc3U6HuTbUVg/ueEOkxOLPRu6O1Lk539mRo7ZkbvW4PB2",
          last_login_at: null,
          created_at: "2024-08-23T16:09:24.981Z",
          updated_at: "2024-08-23T16:09:24.981Z",
          deleted_at: null,
        },
      },
    },
    CreateUserPayload: {
      full_name: "Femi Fatokun",
      email: "curious52022@gmail.com",
      password: "12345678",
    },
    UserTradeHistoryResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 16,
        total_pages: 1,
        trades: [
          {
            id: 16,
            symbol: "A",
            start_time: "2024-09-06T14:31:24.246Z",
            expiry_time: "2024-09-06T14:32:00.000Z",
            amount: "1000.00",
            prediction: "higher",
            prediction_correct: true,
            status: "evaluated",
            initial_value: "39754656559.56",
            completed_value: "39754656559.56",
            livemode: false,
            created_at: "2024-09-06T14:31:25.576Z",
            updated_at: "2024-09-06T14:33:42.468Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            transaction_id: 18,
          },
          {
            id: 1,
            symbol: "A",
            start_time: "2024-09-04T16:46:36.069Z",
            expiry_time: "2024-09-04T16:47:00.000Z",
            amount: "1000.00",
            prediction: "higher",
            prediction_correct: null,
            status: "waiting",
            initial_value: "39510428039.21",
            completed_value: null,
            livemode: false,
            created_at: "2024-09-04T16:46:37.234Z",
            updated_at: "2024-09-04T16:46:37.234Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            transaction_id: 1,
          },
        ],
      },
      message: "Request successful.",
    },
    StaffAuthDashboardResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        total_no_active_users: 2,
        total_no_users: 2,
        total_no_pending_payouts: 0,
        total_no_pending_withdrawals: 0,
      },
    },
    StaffListTransactionsEndpoint: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 18,
        total_pages: 1,
        transactions: [
          {
            id: 19,
            ref: "1725633120000-16-5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            amount: "1900.00",
            type: "credit",
            status: "completed",
            metadata: '{"order_id":16}',
            livemode: false,
            desc: "Reward for correct prediction.",
            created_at: "2024-09-06T14:33:42.458Z",
            updated_at: "2024-09-06T14:33:42.458Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            wallet_id: 1,
          },
        ],
      },
      message: "Request successful.",
    },
    ListWalletsResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 1,
        total_pages: 1,
        wallets: [
          {
            id: 1,
            balance: "98800.00",
            bonus: "0.00",
            livemode: true,
            created_at: "2024-08-28T10:54:43.814Z",
            updated_at: "2024-09-06T14:33:42.471Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            user: {
              id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
              first_name: "Femi",
              email: "fatokunfemi03@gmail.com",
              created_at: "2024-08-12T14:31:20.545Z",
              updated_at: "2024-09-29T09:31:58.688Z",
              is_disabled: false,
            },
          },
        ],
      },
      message: "Request successful.",
    },
    StaffFinanceDashboardResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        total_deposits: null,
        total_withdrawals: 4000,
        total_pending_transactions: null,
        total_revenue: 0,
        total_payout: 0,
        total_pending_payout: 0,
        total_pending_withdrawal: null,
      },
    },
    StaffGetTransactionResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        transaction: {
          id: 5,
          ref: "1725470171097-1725470220000-5-5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          amount: "1000.00",
          type: "debit",
          status: "completed",
          metadata: "{}",
          livemode: true,
          desc: "Payment for options contract.",
          payment_methods: null,
          created_at: "2024-09-04T17:02:25.766Z",
          updated_at: "2024-09-04T17:16:13.541Z",
          user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          wallet_id: 1,
          transaction_user: {
            id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            first_name: "Femi",
            last_name: "Fatokun",
            email: "fatokunfemi03@gmail.com",
            is_disabled: false,
            pfp_url: null,
          },
          transaction_wallet: {
            id: 1,
            balance: "98800.00",
            bonus: "0.00",
            livemode: true,
            created_at: "2024-08-28T10:54:43.814Z",
            updated_at: "2024-09-06T14:33:42.471Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          },
          order: {
            id: 4,
            symbol: "A",
            start_time: "2024-09-04T17:02:24.508Z",
            expiry_time: "2024-09-04T17:10:00.000Z",
            amount: "1000.00",
            prediction: "higher",
            prediction_correct: null,
            status: "waiting",
            initial_value: "39927053162.16",
            completed_value: null,
            livemode: false,
            created_at: "2024-09-04T17:02:25.777Z",
            updated_at: "2024-09-04T17:02:25.777Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            transaction_id: 5,
          },
        },
      },
    },
    StaffListTransactionsResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 4,
        total_pages: 1,
        transactions: [
          {
            id: 5,
            ref: "1725470171097-1725470220000-5-5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            amount: "1000.00",
            type: "debit",
            status: "completed",
            metadata: "{}",
            livemode: true,
            desc: "Payment for options contract.",
            payment_methods: null,
            created_at: "2024-09-04T17:02:25.766Z",
            updated_at: "2024-09-04T17:16:13.541Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            wallet_id: null,
          },
          {
            id: 3,
            ref: "1725468668108-1725468720000-3-5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            amount: "1000.00",
            type: "debit",
            status: "completed",
            metadata: "{}",
            livemode: true,
            desc: "Payment for options contract.",
            payment_methods: null,
            created_at: "2024-09-04T16:51:09.427Z",
            updated_at: "2024-09-04T16:51:09.448Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            wallet_id: null,
          },
          {
            id: 2,
            ref: "1725468543211-1725468600000-2-5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            amount: "1000.00",
            type: "debit",
            status: "completed",
            metadata: "{}",
            livemode: true,
            desc: "Payment for options contract.",
            payment_methods: null,
            created_at: "2024-09-04T16:49:04.353Z",
            updated_at: "2024-09-04T16:49:04.368Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            wallet_id: null,
          },
          {
            id: 1,
            ref: "1725468396069-1725468420000-1-5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            amount: "1000.00",
            type: "debit",
            status: "completed",
            metadata: "{}",
            livemode: true,
            desc: "Payment for options contract.",
            payment_methods: null,
            created_at: "2024-09-04T16:46:37.219Z",
            updated_at: "2024-09-04T16:46:37.239Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            wallet_id: null,
          },
        ],
      },
      message: "Request successful.",
    },
    StaffLoginResponse: {
      ok: true,
      message: "Request Successful",
      status: 200,
      body: {
        tokens: { auth: "string", refresh: "token" },
        id: "number",
      },
    },
    StaffGetTradeResponse: {
      ok: true,
      message: "Request successful.",
      body: {
        trade: {
          id: 5,
          symbol: "A",
          start_time: "2024-09-04T17:16:11.097Z",
          expiry_time: "2024-09-04T17:17:00.000Z",
          amount: "1000.00",
          prediction: "higher",
          prediction_correct: null,
          status: "waiting",
          initial_value: "39315045222.93",
          completed_value: null,
          livemode: true,
          created_at: "2024-09-04T17:16:13.538Z",
          updated_at: "2024-09-04T17:16:13.538Z",
          user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          transaction_id: 6,
          transaction: {
            id: 6,
            ref: "1725470300803-1725470340000-6-5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            amount: "1000.00",
            type: "debit",
            status: "completed",
            metadata: "{}",
            livemode: false,
            desc: "Payment for options contract.",
            payment_methods: null,
            created_at: "2024-09-04T17:16:13.527Z",
            updated_at: "2024-09-04T17:18:23.210Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            wallet_id: 1,
          },
          order_user: {
            id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            first_name: "Femi",
            email: "fatokunfemi03@gmail.com",
            created_at: "2024-08-12T14:31:20.545Z",
            updated_at: "2024-09-29T09:31:58.688Z",
            is_disabled: false,
            pfp_url:
              "https://oliveoption.blob.core.windows.net/default/profile_pics/profile_pic_1723724632731_331371914.png",
          },
        },
      },
      status: 200,
    },
    ListFaqsResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 1,
        total_pages: 1,
        faqs: [
          {
            id: 2,
            question: "Hello world",
            answer: "Hi world",
            created_at: "2024-10-13T09:26:10.646Z",
            updated_at: "2024-10-13T09:26:10.646Z",
            category_id: 2,
            category: {
              id: 2,
              name: "Test Category",
              created_at: "2024-10-13T09:13:02.131Z",
              updated_at: "2024-10-13T09:13:02.131Z",
              deleted_at: null,
            },
          },
        ],
      },
      message: "Request successful.",
    },
    CreateFaqPayload: {
      question: "Hello world",
      answer: "Hi world",
      category: 2,
    },
    GetFaqResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        faq: {
          id: 2,
          question: "Hello world",
          answer: "Hi world",
          created_at: "2024-10-13T09:26:10.646Z",
          updated_at: "2024-10-13T09:26:10.646Z",
          category_id: 2,
          category: {
            id: 2,
            name: "Test Category",
            created_at: "2024-10-13T09:13:02.131Z",
            updated_at: "2024-10-13T09:13:02.131Z",
            deleted_at: null,
          },
        },
      },
    },
    CreateFaqCategoryPayload: {
      name: "string",
    },
    GetFaqCategoryResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        category: {
          id: 2,
          name: "Test Category",
          updated_at: "2024-10-13T09:13:02.131Z",
          created_at: "2024-10-13T09:13:02.131Z",
          deleted_at: null,
        },
      },
    },
    ListFaqCategoriesResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 1,
        total_pages: 1,
        categories: [
          {
            id: 2,
            name: "Test Category",
            created_at: "2024-10-13T09:13:02.131Z",
            updated_at: "2024-10-13T09:13:02.131Z",
            deleted_at: null,
          },
        ],
      },
      message: "Request successful.",
    },
    GetContentResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        content: {
          id: 2,
          user_category: "traders",
          category: "Privacy Policy",
          content: "Hello world, we are just testing",
          document_url: null,
          created_at: "2024-10-13T08:58:06.559Z",
          updated_at: "2024-10-13T08:58:06.559Z",
        },
      },
    },
    GetPromotionSectionResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        section: {
          id: 1,
          name: "Section 1",
          type: "Banner",
          thumbnail_url:
            "https://oliveoption.blob.core.windows.net/default/promotional_materials_section_thumbnails/thumbnail_1729326279133_635282416.png",
          updated_at: "2024-10-19T08:25:24.602Z",
          created_at: "2024-10-19T08:25:24.602Z",
        },
      },
    },
    ListPromotionSectionsResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 1,
        total_pages: 1,
        sections: [
          {
            id: 1,
            type: "Banner",
            name: "Section 2",
            thumbnail_url:
              "https://oliveoption.blob.core.windows.net/default/promotional_materials_section_thumbnails/thumbnail_1729326515564_496316983.png",
            created_at: "2024-10-19T08:25:24.602Z",
            updated_at: "2024-10-19T08:28:36.454Z",
          },
        ],
      },
      message: "Request successful.",
    },
    GetMaterialResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        material: {
          id: 1,
          type: "Video",
          language: "EN",
          size: "128x128",
          section_id: 1,
          media_url:
            "https://oliveoption.blob.core.windows.net/default/promotional_materials_media/media_1729327351499_458220077.png",
          updated_at: "2024-10-19T08:42:34.452Z",
          created_at: "2024-10-19T08:42:34.452Z",
        },
      },
    },
    ListMaterialsResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 1,
        total_pages: 1,
        materials: [
          {
            id: 1,
            language: "EN",
            size: "128x200",
            media_url:
              "https://oliveoption.blob.core.windows.net/default/promotional_materials_media/media_1729327489818_785837476.png",
            type: "Video",
            created_at: "2024-10-19T08:42:34.452Z",
            updated_at: "2024-10-19T08:44:50.244Z",
            section_id: 1,
          },
        ],
      },
      message: "Request successful.",
    },
    CreateAffiliateResponse: {
      ok: true,
      statusCode: 201,
      body: {
        id: "uuid-1234",
        userId: "uuid-5678",
        mainLink: "https://affiliate-link.com",
        earnings: 0.0,
        totalDeposits: 0.0,
        nextPaymentDate: "2024-11-01T00:00:00.000Z",
        created_at: "2024-10-16T12:30:00.000Z",
        updated_at: "2024-10-16T12:30:00.000Z",
      },
      tokens: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },
    GetAffiliateByIdResponse: {
      ok: true,
      statusCode: 200,
      body: {
        id: "uuid-1234",
        userId: "uuid-5678",
        mainLink: "https://affiliate-link.com",
        earnings: 150.75,
        totalDeposits: 500.0,
        nextPaymentDate: "2024-11-01T00:00:00.000Z",
        created_at: "2024-01-15T09:45:30.000Z",
        updated_at: "2024-10-16T12:30:00.000Z",
      },
      tokens: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },
    GetPaginatedAffiliatesResponse: {
      ok: true,
      statusCode: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 3,
        total_pages: 1,
        items: [
          {
            id: "uuid-1234",
            userId: "uuid-5678",
            mainLink: "https://affiliate-link.com",
            earnings: 150.75,
            totalDeposits: 500.0,
            nextPaymentDate: "2024-11-01T00:00:00.000Z",
            created_at: "2024-01-15T09:45:30.000Z",
            updated_at: "2024-10-16T12:30:00.000Z",
          },
          {
            id: "uuid-2234",
            userId: "uuid-5679",
            mainLink: "https://affiliate2-link.com",
            earnings: 200.5,
            totalDeposits: 700.0,
            nextPaymentDate: "2024-11-05T00:00:00.000Z",
            created_at: "2024-02-12T09:45:30.000Z",
            updated_at: "2024-10-16T12:40:00.000Z",
          },
        ],
      },
      tokens: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },
    UpdateAffiliateResponse: {
      ok: true,
      statusCode: 200,
      body: {
        id: "uuid-1234",
        userId: "uuid-5678",
        mainLink: "https://updated-affiliate-link.com",
        earnings: 180.0,
        totalDeposits: 550.0,
        nextPaymentDate: "2024-11-15T00:00:00.000Z",
        created_at: "2024-01-15T09:45:30.000Z",
        updated_at: "2024-10-16T13:00:00.000Z",
      },
      tokens: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },
    DeleteAffiliateResponse: {
      ok: true,
      statusCode: 200,
      tokens: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },
    CreateAffiliateUserResponse: {
      ok: true,
      statusCode: 201,
      body: {
        id: "uuid-5678",
        full_name: "John Doe",
        email: "john.doe@example.com",
        referral_code: "REF123",
        is_active: true,
        is_verified: false,
        password: "hashed_password",
        verification_code: "6789",
        verification_type: "email_verification",
        last_login: null,
        tier_level: 1,
        total_referrals: 0,
        referral_code: "NBPHbD",
        country: "United States",
        date_of_birth: "1990-05-15",
        phone_number: "555-1234",
        created_at: "2024-10-16T12:45:00.000Z",
        updated_at: "2024-10-16T12:45:00.000Z",
      },
    },
    GetAffiliateUserByIdResponse: {
      ok: true,
      statusCode: 201,
      body: {
        id: "uuid-5678",
        full_name: "John Doe",
        email: "john.doe@example.com",
        referral_code: "REF123",
        is_active: true,
        is_verified: false,
        password: "hashed_password",
        verification_code: "6789",
        verification_type: "email_verification",
        last_login: null,
        tier_level: 1,
        total_referrals: 0,
        referral_code: "NBPHbD",
        country: "United States",
        date_of_birth: "1990-05-15",
        phone_number: "555-1234",
        created_at: "2024-10-16T12:45:00.000Z",
        updated_at: "2024-10-16T12:45:00.000Z",
      },
      tokens: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },
    GetPaginatedAffiliateUsersResponse: {
      ok: true,
      statusCode: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 3,
        total_pages: 1,
        items: [
          {
            id: 2,
            full_name: "John Doe",
            email: "johndoe@example.com",
            referral_code: null,
            is_active: true,
            is_verified: false,
            password: "hash_password",
            verification_code: "6165",
            verification_type: null,
            last_login: null,
            tier_level: 1,
            total_referrals: 0,
            referral_code: "REF123",
            country: null,
            date_of_birth: null,
            phone_number: null,
            created_at: "2024-10-20T01:38:45.901Z",
            updated_at: "2024-10-20T01:38:45.901Z",
            deleted_at: null,
          },
          {
            id: 4,
            full_name: "Bob Johnson",
            email: "bob@example.com",
            referral_code: null,
            is_active: false,
            is_verified: false,
            password: "hash_password",
            verification_code: "5678",
            verification_type: null,
            last_login: null,
            tier_level: 1,
            total_referrals: 2,
            referral_code: "REF456",
            country: "Canada",
            date_of_birth: "1992-11-30",
            phone_number: "555-5678",
            created_at: "2024-10-20T01:38:45.901Z",
            updated_at: "2024-10-20T01:38:45.901Z",
            deleted_at: null,
          },
        ],
      },
      tokens: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },
    GetPaginatedUserReferralsResponse: {
      ok: true,
      statusCode: 200,
      body: {
        referrals: [
          {
            id: 4,
            full_name: "Bob Johnson",
            email: "bob@example.com",
            verification_status: false,
            userType: "Affiliate",
            registration_date: "2024-10-20T01:38:45.901Z",
            referred_count: 2,
          },
          {
            id: 5,
            full_name: "John Doe",
            email: "john.doe@example.com",
            verification_status: false,
            userType: "Trader",
            registration_date: "2024-10-20T01:38:45.901Z",
            referred_count: 2,
          },
        ],
        total_count: 12,
        total_pages: 2,
      },
      tokens: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },
    SigninAffiliateUserResponse: {
      ok: true,
      statusCode: 200,
      body: {
        user: {
          id: 4,
          full_name: "Bob Johnson",
          email: "bob@example.com",
          referral_code: null,
          is_active: false,
          is_verified: false,
          password: "hash_password",
          verification_code: "5678",
          verification_type: null,
          last_login: null,
          tier_level: 1,
          total_referrals: 2,
          referral_code: "REF456",
          country: "Canada",
          date_of_birth: "1992-11-30",
          phone_number: "555-5678",
          created_at: "2024-10-20T01:38:45.901Z",
          updated_at: "2024-10-20T01:38:45.901Z",
          deleted_at: null,
        },
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },
    LogoutAffiliateUserResponse: {
      ok: true,
      statusCode: 200,
      message: "User has successfully logged out.",
      body: null,
    },
    VerifyOtpAffiliateUserResponse: {
      ok: true,
      statusCode: 200,
      message: "OTP has successfully verified.",
      body: null,
    },
    VerifyEmailAffiliateUserResponse: {
      ok: true,
      statusCode: 200,
      message: "Email has successfully verified.",
      body: null,
    },
    ResendVerificationCodeAffiliateUserResponse: {
      ok: true,
      statusCode: 200,
      message: "Verification code has been resent successfully.",
      body: null,
    },
    SendPasswordChangeOtpAffiliateUserResponse: {
      ok: true,
      statusCode: 200,
      message: "Password change OTP has been sent successfully.",
      body: null,
    },
    ChangePasswordAffiliateUserResponse: {
      ok: true,
      statusCode: 200,
      message: "Password has been successfully changed.",
      body: null,
    },
    RefreshTokenAffiliateUserResponse: {
      ok: true,
      statusCode: 200,
      message: "Refresh token has been successfully refreshed.",
      body: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },
    CreatePromoCodeResponse: {
      ok: true,
      statusCode: 201,
      body: {
        id: "uuid-1234",
        code: "PROMO12",
        expiryDate: "2024-12-31T23:59:59.999Z",
        usageLimit: 100,
        usedCount: 0,
        discountAmount: 20.0,
        is_active: true,
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-10-22T12:00:00.000Z",
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },
    UpdatePromoCodeResponse: {
      ok: true,
      statusCode: 200,
      body: {
        id: "uuid-1234",
        code: "PROMO12",
        expiryDate: "2024-12-31T23:59:59.999Z",
        usageLimit: 150,
        usedCount: 10,
        discountAmount: 25.0,
        is_active: false,
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-10-22T12:30:00.000Z",
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },
    GetPromoCodeByIdResponse: {
      ok: true,
      statusCode: 200,
      body: {
        id: "uuid-1234",
        code: "PROMO12",
        expiryDate: "2024-12-31T23:59:59.999Z",
        usageLimit: 100,
        usedCount: 10,
        discountAmount: 20.0,
        is_active: true,
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-10-22T12:30:00.000Z",
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },
    GetAllPromoCodesResponse: {
      ok: true,
      statusCode: 200,
      body: [
        {
          id: "uuid-1234",
          code: "PROMO12",
          expiryDate: "2024-12-31T23:59:59.999Z",
          usageLimit: 100,
          usedCount: 10,
          discountAmount: 20.0,
          is_active: true,
          created_at: "2024-10-22T12:00:00.000Z",
          updated_at: "2024-10-22T12:30:00.000Z",
        },
        {
          id: "uuid-5678",
          code: "PROMO45",
          expiryDate: "2025-01-01T23:59:59.999Z",
          usageLimit: 50,
          usedCount: 5,
          discountAmount: 15.0,
          is_active: false,
          created_at: "2024-10-20T12:00:00.000Z",
          updated_at: "2024-10-21T12:30:00.000Z",
        },
      ],
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },
    DeletePromoCodeResponse: {
      ok: true,
      status: 204,
      body: null,
      message: "Promo code deleted successfully.",
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },
    ValidatePromoCodeResponse: {
      ok: true,
      statusCode: 200,
      message: "Promo code is valid.",
      body: {
        promoCode: {
          id: "uuid-1234",
          code: "PROMO12",
          expiryDate: "2024-12-31T23:59:59.999Z",
          usageLimit: 100,
          usedCount: 10,
          discountAmount: 20.0,
          is_active: true,
        },
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },
    CreateAffiliateLinkResponse: {
      ok: true,
      statusCode: 201,
      body: {
        id: "uuid-1234",
        userId: 123,
        linkTypeId: 1,
        affiliateProgramId: 2,
        link: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=456&comment=Special%20referral%20offer&linkId=456",
        promoCode: "PROMO12",
        comment: "This is a test comment.",
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-10-22T12:00:00.000Z",
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    UpdateAffiliateLinkResponse: {
      ok: true,
      statusCode: 201,
      body: {
        id: "uuid-1234",
        userId: 123,
        linkTypeId: 1,
        affiliateProgramId: 2,
        link: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=affiliateId456&comment=Special%20referral%20offer&linkId=affiliateId456",
        promoCode: "PROMO12",
        comment: "This is an updated comment.",
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-12-22T12:00:00.000Z",
      },

      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    GetAffiliateLinkByIdResponse: {
      ok: true,
      statusCode: 200,
      body: {
        id: "uuid-1234",
        userId: 123,
        linkTypeId: 1,
        affiliateProgramId: 2,
        link: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=affiliateId456&comment=Special%20referral%20offer&linkId=affiliateId456",
        promoCode: "PROMO12",
        comment: "This is a test comment.",
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-10-22T12:00:00.000Z",
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },
    GetAllAffiliateLinksResponse: {
      ok: true,
      statusCode: 200,
      body: [
        {
          id: "uuid-1234",
          userId: 123,
          linkTypeId: 1,
          affiliateProgramId: 2,
          link: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=affiliateId456&comment=Special%20referral%20offer&linkId=affiliateId456",
          promoCode: "PROMO12",
          comment: "This is a test comment.",
          created_at: "2024-10-22T12:00:00.000Z",
          updated_at: "2024-10-22T12:00:00.000Z",
        },
        {
          id: "uuid-5678",
          userId: 124,
          linkTypeId: 1,
          affiliateProgramId: 2,
          link: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=affiliateId456&comment=Special%20referral%20offer&linkId=affiliateId456",
          promoCode: null,
          comment: null,
          created_at: "2024-10-22T12:30:00.000Z",
          updated_at: "2024-10-22T12:30:00.000Z",
        },
      ],
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },
    GetPaginatedAffiliateLinksResponse: {
      ok: true,
      statusCode: 200,
      body: {
        page: 1,
        size: 10,
        totalCount: 2,
        totalPages: 1,
        items: [
          {
            id: "uuid-1234",
            userId: 123,
            linkTypeId: 1,
            affiliateProgramId: 2,
            link: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=affiliateId456&comment=Special%20referral%20offer&linkId=affiliateId456",
            promoCode: "PROMO12",
            comment: "This is a test comment.",
            created_at: "2024-10-22T12:00:00.000Z",
            updated_at: "2024-10-22T12:00:00.000Z",
          },
          {
            id: "uuid-5678",
            userId: 124,
            linkTypeId: 1,
            affiliateProgramId: 2,
            link: "https://affiliate.example.com/link2",
            promoCode: null,
            comment: null,
            created_at: "2024-10-22T12:30:00.000Z",
            updated_at: "2024-10-22T12:30:00.000Z",
          },
        ],
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    CreateAffiliateLinkTypeResponse: {
      ok: true,
      statusCode: 201,
      message: "Affiliate link type created successfully.",
      body: {
        id: "uuid-1234",
        name: "Referral link type",
        url: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=affiliateId456&comment=Special%20referral%20offer&linkId=affiliateId456",
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-10-22T12:00:00.000Z",
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    UpdateAffiliateLinkTypeResponse: {
      ok: true,
      statusCode: 200,
      message: "Affiliate link type updated successfully.",
      body: {
        id: "uuid-1234",
        name: "Updated referral Link",
        url: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=affiliateId456&comment=Special%20referral%20offer&linkId=affiliateId456",
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-10-22T12:00:00.000Z",
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    GetAffiliateLinkTypeByIdResponse: {
      ok: true,
      statusCode: 200,
      body: {
        id: "uuid-1234",
        name: "Referral link type",
        url: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=affiliateId456&comment=Special%20referral%20offer&linkId=affiliateId456",
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-10-22T12:00:00.000Z",
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    GetAllAffiliateLinkTypesResponse: {
      ok: true,
      statusCode: 200,
      body: [
        {
          id: "uuid-1234",
          name: "Referral link type 1",
          url: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=affiliateId456&comment=Special%20referral%20offer&linkId=affiliateId456",
          created_at: "2024-10-22T12:00:00.000Z",
          updated_at: "2024-10-22T12:00:00.000Z",
        },
        {
          id: "uuid-5678",
          name: "Referral link type 2",
          url: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=affiliateId456&comment=Special%20referral%20offer&linkId=affiliateId456",
          created_at: "2024-10-22T12:30:00.000Z",
          updated_at: "2024-10-22T12:30:00.000Z",
        },
      ],
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    ValidateAffiliateLinkTypeResponse: {
      ok: true,
      statusCode: 200,
      body: {
        linkType: {
          id: "uuid-1234",
          name: "Referral link type",
          url: "https://example.com/?referralCode=ABC123&promoCode=PROMO2023&id=affiliateId456&comment=Special%20referral%20offer&linkId=affiliateId456",
          created_at: "2024-10-22T12:00:00.000Z",
          updated_at: "2024-10-22T12:00:00.000Z",
        },
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    CreateAffiliateProgramTypeResponse: {
      ok: true,
      statusCode: 201,
      message: "Affiliate program type created successfully.",
      body: {
        id: "uuid-1234",
        name: "Affiliate program type",
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-10-22T12:00:00.000Z",
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    UpdateAffiliateProgramTypeResponse: {
      ok: true,
      statusCode: 200,
      message: "Affiliate program type updated successfully.",
      body: {
        id: "uuid-1234",
        name: "Updated affiliate program type",
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-10-22T12:00:00.000Z",
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    GetAffiliateProgramTypeByIdResponse: {
      ok: true,
      statusCode: 200,
      body: {
        id: "uuid-1234",
        name: "Affiliate program type",
        created_at: "2024-10-22T12:00:00.000Z",
        updated_at: "2024-10-22T12:00:00.000Z",
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    GetAllAffiliateProgramTypesResponse: {
      ok: true,
      statusCode: 200,
      body: [
        {
          id: "uuid-1234",
          name: "Affiliate program type 1",
          created_at: "2024-10-22T12:00:00.000Z",
          updated_at: "2024-10-22T12:00:00.000Z",
        },
        {
          id: "uuid-5678",
          name: "Affiliate program type 2",
          created_at: "2024-10-22T12:30:00.000Z",
          updated_at: "2024-10-22T12:30:00.000Z",
        },
      ],
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    ValidateAffiliateProgramTypeResponse: {
      ok: true,
      statusCode: 200,
      body: {
        affiliateProgram: {
          id: "uuid-1234",
          name: "Affiliate program type",
          created_at: "2024-10-22T12:00:00.000Z",
          updated_at: "2024-10-22T12:00:00.000Z",
        },
      },
      tokens: {
        accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        refreshToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      },
    },

    CreateAffiliatePayload: {
      userId: "uuid-5678",
      mainLink: "https://affiliate-link.com",
      earnings: 0.0,
      totalDeposits: 0.0,
      nextPaymentDate: "2024-11-01T00:00:00.000Z",
    },

    GetAffiliateByIdPayload: {
      id: "uuid-1234",
    },

    GetPaginatedAffiliatesPayload: {
      page: 1,
      size: 20,
    },

    UpdateAffiliatePayload: {
      id: "uuid-1234",
      userId: "uuid-5678",
      mainLink: "https://updated-affiliate-link.com",
      earnings: 180.0,
      totalDeposits: 550.0,
      nextPaymentDate: "2024-11-15T00:00:00.000Z",
    },

    DeleteAffiliatePayload: {
      id: "uuid-1234",
    },

    CreateAffiliateUserPayload: {
      full_name: "John Doe",
      email: "john.doe@example.com",
      referral_code: "REF123",
      password: "hashed_password",
      country: "United States",
      date_of_birth: "1990-05-15",
      phone_number: "555-1234",
    },

    SigninAffiliateUserPayload: {
      email: "john.doe@example.com",
      password: "plain_text_password",
    },

    LogoutAffiliateUserPayload: {
      userId: "uuid-1234",
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    },

    VerifyOtpAffiliateUserPayload: {
      email: "john.doe@example.com",
      verificationCode: "1234",
    },

    VerifyEmailAffiliateUserPayload: {
      email: "john.doe@example.com",
      verificationCode: "1234",
    },

    ResendVerificationCodeAffiliateUserPayload: {
      email: "john.doe@example.com",
    },

    SendPasswordChangeOtpAffiliateUserPayload: {
      email: "john.doe@example.com",
    },

    ChangePasswordAffiliateUserPayload: {
      email: "john.doe@example.com",
      otp: "1234",
      newPassword: "new_password",
      confirmPassword: "new_password",
    },
    ChangePasswordPayload: {
      old_password: "string",
      new_password: "string",
    },
    UpdateStaffPayload: {
      first_name: "string",
      last_name: "string",
      email: "string",
      language: "string",
      enable_email_notifications: "boolean",
      enable_inapp_notifications: "boolean",
      two_factor_for_signin: "boolean",
      two_factor_for_activities: "boolean",
    },
    RefreshTokenAffiliateUserPayload: {
      accessToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
      refreshToken:
        "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
    },
    CreatePromoCodePayload: {
      code: "PRO",
      expiryDate: "2024-12-31T23:59:59.999Z",
      usageLimit: 100,
      discountAmount: 20.0,
      is_active: true,
    },
    UpdatePromoCodePayload: {
      expiryDate: "2024-12-31T23:59:59.999Z",
      usageLimit: 150,
      discountAmount: 25.0,
      is_active: false,
    },
    ValidatePromoCodePayload: {
      code: "PROMO12",
    },

    CreateAffiliateLinkPayload: {
      linkTypeId: 1,
      affiliateProgramId: 2,
      link: "https://affiliate.example.com/link",
      promoCode: "PROMO12",
      comment: "This is a test comment.",
    },

    UpdateAffiliateLinkPayload: {
      linkTypeId: 1,
      affiliateProgramId: 2,
      link: "https://affiliate.example.com/new-link",
      promoCode: "NEWPROM",
      comment: "Updated comment for the affiliate link.",
    },

    CreateAffiliateLinkTypePayload: {
      name: "Affiliate Link",
    },

    CreateAffiliateProgramTypePayload: {
      name: "Affiliate Program Name",
    },

    GlobalSettingsResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        settings: {
          system_currency: "USD",
        },
      },
    },

    CreateSettingsPayload: {
      key: "string",
      value: "any",
    },

    BlockIpPayload: {
      ip: "string",
    },

    ListBlockedIps: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 1,
        total_pages: 1,
        ips: [
          {
            id: 2,
            ip: "192.168.0.1",
            created_at: "2024-10-21T06:49:35.801Z",
            updated_at: "2024-10-21T06:49:35.801Z",
          },
        ],
      },
      message: "Request successful.",
    },
    CreateTradePairPayload: {
      category: "string",
      base_asset: "string",
      quote_asset: "string",
      is_active: "boolean",
    },
    GetTradePairResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        pair: {
          id: 2,
          name: "AAPL/USD",
          category: "stock",
          base_asset: "AAPL",
          quote_asset: "USD",
          is_active: true,
          profit_percent: 90,
          created_at: "2024-10-31T06:48:26.118Z",
          updated_at: "2024-10-31T06:48:26.118Z",
        },
      },
    },
    ListTradePairsResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 1,
        total_pages: 1,
        pairs: [
          {
            id: 2,
            name: "AAPL/USD",
            category: "stock",
            base_asset: "AAPL",
            quote_asset: "USD",
            is_active: true,
            created_at: "2024-10-31T06:48:26.118Z",
            updated_at: "2024-10-31T06:48:26.118Z",
          },
        ],
      },
      message: "Request successful.",
    },
    CreateAlertPayload: {
      ticker: "string",
      amount: "number",
    },
    GetAlertResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        alert: {
          id: 2,
          ticker: "AAPL",
          amount: "56000.00000000",
          user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          updated_at: "2024-10-31T07:16:27.786Z",
          created_at: "2024-10-31T07:16:27.786Z",
        },
      },
    },
    ListAlertsResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        size: 20,
        page: 1,
        total_count: 1,
        total_pages: 1,
        alerts: [
          {
            id: 2,
            ticker: "AAPL",
            amount: "56000.00000000",
            created_at: "2024-10-31T07:16:27.786Z",
            updated_at: "2024-10-31T07:16:27.786Z",
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
          },
        ],
      },
    },
    GetTickerResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        tickers: [
          {
            ticker: "X:00USD",
            name: "00 Token - United States dollar",
            market: "crypto",
            locale: "global",
            active: true,
            currency_symbol: "USD",
            currency_name: "United States dollar",
            base_currency_symbol: "00",
            base_currency_name: "00 Token",
            last_updated_utc: "2017-01-01T00:00:00Z",
          },
        ],
      },
    },
    GetLeadersResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        leadersboard: [
          {
            id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            first_name: "Femi",
            last_name: "Fatokun",
            pfp_url:
              "https://oliveoption.blob.core.windows.net/default/profile_pics/profile_pic_1723724632731_331371914.png",
            profit: "2000.00",
          },
        ],
      },
    },
    CreateProfitOutcomePayload: {
      ticker: "string",
      profit_outcome: "number",
    },

    CreateProfitOutcomeResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        outcome: {
          id: 1,
          ticker: "NVDA",
          profit_outcome: "50",
          updated_at: "2024-10-21T06:53:33.023Z",
          created_at: "2024-10-21T06:53:33.023Z",
        },
      },
    },

    ListCustomProfitOutcomeResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 1,
        total_pages: 1,
        outcomes: [
          {
            id: 1,
            ticker: "NVDA",
            profit_outcome: "50",
            created_at: "2024-10-21T06:53:33.023Z",
            updated_at: "2024-10-21T06:53:33.023Z",
          },
        ],
      },
      message: "Request successful.",
    },

    CreateComissionPayload: {
      ticker: "string",
      sell_commission: "string",
      buy_commission: "string",
    },

    GetComissionResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        comission: {
          id: 1,
          ticker: "NVDA",
          sell_commission: "50",
          buy_commission: "50",
          updated_at: "2024-10-21T07:13:29.226Z",
          created_at: "2024-10-21T07:13:29.226Z",
        },
      },
    },

    ListComissionsResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        total_count: 1,
        total_pages: 1,
        comissions: [
          {
            id: 1,
            ticker: "NVDA",
            buy_commission: "50",
            sell_commission: "50",
            created_at: "2024-10-21T07:13:29.226Z",
            updated_at: "2024-10-21T07:13:29.226Z",
          },
        ],
      },
      message: "Request successful.",
    },

    CreateAffiliateClickPayload: {
      clickedAt: "2024-10-27T10:15:00.000Z",
      linkId: 456,
    },

    UpdateAffiliateClickPayload: {
      linkId: 456,
      metadata: {
        device: "mobile",
        location: {
          country: "Canada",
          region: "Ontario",
          city: "Toronto",
          ip: "192.168.1.2",
        },
        engagement: {
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
        },
      },
    },

    CreateAffiliateClickResponse: {
      ok: true,
      status: 201,
      body: {
        id: 1,
        userId: 123,
        linkId: 456,
        clickedAt: "2024-10-27T10:15:00.000Z",
        metadata: {
          device: "desktop",
          location: {
            country: "USA",
            region: "New York",
            city: "New York City",
            ip: "192.168.1.10",
          },
          engagement: {
            timestamp: "2024-10-27T10:15:00.000Z",
            userAgent:
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
          },
        },
      },
      message: "Click data created successfully.",
    },

    GetAffiliateClicksResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 20,
        totalCount: 2,
        totalPages: 1,
        items: [
          {
            id: 1,
            userId: 123,
            linkId: 456,
            clickedAt: "2024-10-27T10:15:00.000Z",
            metadata: {
              device: "desktop",
              location: {
                country: "USA",
                region: "California",
                city: "San Francisco",
                ip: "192.168.1.1",
              },
              engagement: {
                timestamp: "2024-10-27T10:15:00.000Z",
                userAgent:
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
              },
            },
          },
          {
            id: 2,
            userId: 124,
            linkId: 457,
            clickedAt: "2024-10-27T11:00:00.000Z",
            metadata: {
              device: "mobile",
              location: {
                country: "Canada",
                region: "Ontario",
                city: "Toronto",
                ip: "192.168.1.2",
              },
              engagement: {
                timestamp: "2024-10-27T11:00:00.000Z",
                userAgent:
                  "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
              },
            },
          },
        ],
      },
      message: "Click data retrieved successfully.",
    },

    GetAffiliateClickByIdResponse: {
      ok: true,
      status: 200,
      body: {
        id: 1,
        userId: 123,
        linkId: 456,
        clickedAt: "2024-10-27T10:15:00.000Z",
        metadata: {
          device: "desktop",
          location: {
            country: "USA",
            region: "California",
            city: "San Francisco",
            ip: "192.168.1.1",
          },
          engagement: {
            timestamp: "2024-10-27T10:15:00.000Z",
            userAgent:
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
          },
        },
      },
      message: "Click data retrieved successfully.",
    },

    UpdateAffiliateClickResponse: {
      ok: true,
      status: 200,
      body: {
        id: 1,
        userId: 123,
        linkId: 456,
        clickedAt: "2024-10-27T10:15:00.000Z",
        metadata: {
          device: "mobile",
          location: {
            country: "Canada",
            region: "Ontario",
            city: "Toronto",
            ip: "192.168.1.2",
          },
          engagement: {
            timestamp: "2024-10-27T10:15:00.000Z",
            userAgent:
              "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
          },
        },
      },
      message: "Click data updated successfully.",
    },

    DeleteAffiliateClickResponse: {
      ok: true,
      status: 204,
      body: null,
      message: "Click data deleted successfully.",
    },

    CreateActivityPayload: {
      userId: 1,
      activityType: "SIGN_UP",
      affiliateUserId: null,
      performedAt: "2024-10-21T07:13:29.226Z",
    },

    UpdateActivityPayload: {
      id: 1,
      userId: 1,
      activityType: "PASSWORD_CHANGE",
      affiliateUserId: null,
      performedAt: "2024-10-21T07:13:29.226Z",
    },

    CreateActivityResponse: {
      ok: true,
      status: 201,
      body: {
        id: 1,
        userId: 1,
        activityType: "SIGN_UP",
        affiliateUserId: null,
        performedAt: "2024-10-21T07:13:29.226Z",
        userAgent: "Mozilla/5.0",
        ipAddress: "192.168.1.1",
        created_at: "2024-10-21T07:13:29.226Z",
        updated_at: "2024-10-21T07:13:29.226Z",
      },
      message: "Activity created successfully.",
    },

    GetActivityByIdResponse: {
      ok: true,
      status: 200,
      body: {
        id: 1,
        userId: 1,
        activityType: "SIGN_UP",
        affiliateUserId: null,
        performedAt: "2024-10-21T07:13:29.226Z",
        userAgent: "Mozilla/5.0",
        ipAddress: "192.168.1.1",
        created_at: "2024-10-21T07:13:29.226Z",
        updated_at: "2024-10-21T07:13:29.226Z",
      },
      message: "Activity fetched successfully.",
    },

    GetAllActivitiesResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 10,
        totalCount: 1,
        totalPages: 1,
        items: [
          {
            id: 1,
            userId: 1,
            activityType: "SIGN_UP",
            affiliateUserId: null,
            performedAt: "2024-10-21T07:13:29.226Z",
            userAgent: "Mozilla/5.0",
            ipAddress: "192.168.1.1",
            created_at: "2024-10-21T07:13:29.226Z",
            updated_at: "2024-10-21T07:13:29.226Z",
          },
        ],
      },
      message: "Activities fetched successfully.",
    },

    UpdateActivityResponse: {
      ok: true,
      status: 200,
      body: {
        id: 1,
        userId: 1,
        activityType: "PASSWORD_CHANGE",
        affiliateUserId: null,
        performedAt: "2024-10-21T07:13:29.226Z",
        userAgent: "Mozilla/5.0",
        ipAddress: "192.168.1.1",
        created_at: "2024-10-21T07:13:29.226Z",
        updated_at: "2024-10-22T07:13:29.226Z",
      },
      message: "Activity updated successfully.",
    },

    DeleteActivityResponse: {
      ok: true,
      status: 200,
      body: null,
      message: "Activity deleted successfully.",
    },

    ValidateReferralCodeResponse: {
      ok: true,
      statusCode: 200,
      message: "Referral ID is valid.",
      body: true,
    },

    CreateAffiliateTelegramLinkPayload: {
      userType: "AffiliateUser",
    },

    CreateAffiliateTelegramLinkResponse: {
      ok: true,
      status: 201,
      message: "Linking process initiated. Provide this link to the user.",
      body: {
        userId: 12345,
        userType: "AffiliateUser",
        state: "unique_state",
        status: "pending",
        url: "https://t.me/olive_cherry_bot",
      },
      token: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },

    UpdateAffiliateTelegramLinkPayload: {
      telegramChatId: "123456789",
      telegramUsername: "affiliate_telegram_updated",
    },

    GetAllAffiliateTelegramLinksResponse: {
      ok: true,
      status: 200,
      body: [
        {
          id: 1,
          userId: 123,
          userType: "AffiliateUser",
          telegramChatId: "123456789",
          telegramUsername: "example_username",
          created_at: "2024-10-31T06:48:26.118Z",
          updated_at: "2024-10-31T06:48:26.118Z",
        },
      ],
      message: "Request successful.",
      token: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },

    GetAffiliateTelegramLinkByIdResponse: {
      ok: true,
      status: 200,
      body: {
        id: 1,
        userId: 123,
        userType: "AffiliateUser",
        telegramChatId: "123456789",
        telegramUsername: "example_username",
        created_at: "2024-10-31T06:48:26.118Z",
        updated_at: "2024-10-31T06:48:26.118Z",
      },
      message: "Request successful.",
      token: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },

    UpdateAffiliateTelegramLinkResponse: {
      ok: true,
      status: 200,
      body: {
        id: 1,
        userId: 123,
        userType: "AffiliateUser",
        telegramChatId: "123456789",
        telegramUsername: "updated_username",
        created_at: "2024-10-31T06:48:26.118Z",
        updated_at: "2024-11-01T07:30:00.000Z",
      },
      message: "Affiliate Telegram link updated successfully.",
      token: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },

    DeleteAffiliateTelegramLinkResponse: {
      ok: true,
      status: 204,
      message: "Affiliate Telegram link deleted successfully.",
      token: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },

    AffiliateUserResponse: {
      id: 1,
      fullName: "John Doe",
      email: "john.doe@example.com",
      isActive: true,
      isVerified: true,
      created_at: "2024-10-21T07:13:29.226Z",
      updated_at: "2024-10-21T07:13:29.226Z",
    },

    UpdateAffiliateUserRequest: {
      fullName: "John Doe Updated",
      email: "updated.email@example.com",
    },

    AffiliateActivityResponse: {
      ok: true,
      status: 200,
      body: {
        id: 1,
        userId: 1,
        activityType: "password_change",
        performedAt: "2024-10-21T07:13:29.226Z",
        userAgent: "Mozilla/5.0",
        ipAddress: "192.168.1.1",
        created_at: "2024-10-21T07:13:29.226Z",
        updated_at: "2024-10-21T07:13:29.226Z",
      },
      message: "Activity retrieved successfully.",
    },

    CreateAffiliateActivityRequest: {
      activityType: "sign_up",
    },

    CreateAffiliateActivityResponse: {
      ok: true,
      status: 201,
      body: {
        id: 1,
        userId: 1,
        activityType: "sign_up",
        performedAt: "2024-10-21T07:13:29.226Z",
        userAgent: "Mozilla/5.0",
        ipAddress: "192.168.1.1",
        created_at: "2024-10-21T07:13:29.226Z",
        updated_at: "2024-10-21T07:13:29.226Z",
      },
      message: "Activity created successfully.",
    },

    GetAllAffiliateActivitiesResponse: {
      ok: true,
      status: 200,
      body: {
        page: 1,
        size: 10,
        totalCount: 1,
        totalPages: 1,
        items: [
          {
            id: 1,
            userId: 1,
            activityType: "sign_up",
            performedAt: "2024-10-21T07:13:29.226Z",
            userAgent: "Mozilla/5.0",
            ipAddress: "192.168.1.1",
            created_at: "2024-10-21T07:13:29.226Z",
            updated_at: "2024-10-21T07:13:29.226Z",
          },
        ],
      },
      message: "Activities fetched successfully.",
    },

    GetUserClicksResponse: {
      ok: true,
      status: 200,
      body: [
        {
          date: "2024-10-01",
          counts: 15,
        },
        {
          date: "2024-10-02",
          counts: 22,
        },
        {
          date: "2024-10-03",
          counts: 18,
        },
      ],
      message: "User clicks retrieved successfully.",
    },

    GetUserReferralsStatsResponse: {
      ok: true,
      status: 200,
      body: [
        {
          date: "2024-10-01",
          counts: 5,
        },
        {
          date: "2024-10-02",
          counts: 8,
        },
        {
          date: "2024-10-03",
          counts: 3,
        },
      ],
      message: "User referrals retrieved successfully.",
    },

    GetUserClicksAndReferralsStatsResponse: {
      ok: true,
      status: 200,
      body: {
        clicks: [
          {
            date: "2024-10-01",
            counts: 15,
          },
          {
            date: "2024-10-02",
            counts: 22,
          },
          {
            date: "2024-10-03",
            counts: 18,
          },
        ],
        referrals: [
          {
            date: "2024-10-01",
            counts: 5,
          },
          {
            date: "2024-10-02",
            counts: 8,
          },
          {
            date: "2024-10-03",
            counts: 3,
          },
        ],
      },
      message: "User clicks and referrals retrieved successfully.",
    },

    CreatePostbackPayload: {
      linkId: 1,
      event_id: "eid12345",
      status: "reg",
      click_id: "cid12345",
      site_id: "sid12345",
      linkIdValue: "lid12345",
      trader_id: null,
      payout: 100,
      method: "POST",
      url: "https://example.com/postback.php",
      timestamp: "2024-11-28T12:00:00.000Z",
    },

    CreatePostbackResponse: {
      id: 1,
      affiliateId: 1,
      linkId: 1,
      event_id: "eid12345",
      status: "reg",
      click_id: "cid12345",
      site_id: "sid12345",
      linkIdValue: "lid12345",
      trader_id: null,
      payout: 100,
      method: "POST",
      url: "https://example.com/postback.php",
      timestamp: "2024-11-28T12:00:00.000Z",
      created_at: "2024-11-28T12:00:00.000Z",
      updated_at: "2024-11-28T12:00:00.000Z",
      deleted_at: null,
    },

    GetPostbackByIdResponse: {
      id: 1,
      affiliateId: 1,
      linkId: 1,
      event_id: "eid12345",
      status: "reg",
      click_id: "cid12345",
      site_id: "sid12345",
      linkIdValue: "lid12345",
      trader_id: null,
      payout: 100.0,
      method: "POST",
      url: "https://example.com/postback.php",
      timestamp: "2024-11-28T12:00:00.000Z",
      created_at: "2024-11-28T12:00:00.000Z",
      updated_at: "2024-11-28T12:00:00.000Z",
      deleted_at: null,
    },

    UpdatePostbackPayload: {
      status: "conf",
      click_id: "cid12345-updated",
      site_id: "sid12345-updated",
      linkIdValue: "lid12345-updated",
      trader_id: "uid12345-updated",
      payout: 200.0,
      method: "POST",
      url: "https://example.com/postback.php?status={status}&eid={eventId}&cid={click_id}&sid={site_id}&lid={linkId}&uid={trader_id}&payout={sumdep}",
      timestamp: "2024-11-28T12:00:00.000Z",
    },

    UpdatePostbackResponse: {
      id: 1,
      affiliateId: 1,
      linkId: 1,
      eventId: "eid12345",
      status: "conf",
      click_id: "cid12345-updated",
      site_id: "sid12345-updated",
      linkIdValue: "lid12345-updated",
      trader_id: "uid12345-updated",
      payout: 200.0,
      method: "POST",
      url: "https://example.com/postback.php?status={status}&eid={eventId}&cid={click_id}&sid={site_id}&lid={linkId}&uid={trader_id}&payout={sumdep}",
      timestamp: "2024-11-28T12:00:00.000Z",
      created_at: "2024-11-28T12:00:00.000Z",
      updated_at: "2024-11-28T12:00:00.000Z",
      deleted_at: null,
    },

    DeletePostbackResponse: {
      message: "Postback deleted successfully",
    },

    GetPostbacksByUserIdResponse: [
      {
        id: 1,
        affiliateId: 1,
        linkId: 1,
        eventId: "eid12345",
        status: "reg",
        click_id: "cid12345",
        site_id: "sid12345",
        linkIdValue: "lid12345",
        trader_id: "uid12345",
        payout: 100.0,
        method: "POST",
        url: "https://example.com/postback.php?status={status}&eid={eventId}&cid={click_id}&sid={site_id}&lid={linkId}&uid={trader_id}&payout={sumdep}",
        timestamp: "2024-11-28T12:00:00.000Z",
        created_at: "2024-11-28T12:00:00.000Z",
        updated_at: "2024-11-28T12:00:00.000Z",
        deleted_at: null,
      },
      {
        id: 2,
        affiliateId: 2,
        linkId: 2,
        eventId: "eid54321",
        status: "conf",
        click_id: "cid54321",
        site_id: "sid54321",
        linkIdValue: "lid54321",
        trader_id: "uid54321",
        payout: 150.0,
        method: "POST",
        url: "https://example.com/postback.php?status={status}&eid={eventId}&cid={click_id}&sid={site_id}&lid={linkId}&uid={trader_id}&payout={sumdep}",
        timestamp: "2024-11-28T12:00:00.000Z",
        created_at: "2024-11-28T12:00:00.000Z",
        updated_at: "2024-11-28T12:00:00.000Z",
        deleted_at: null,
      },
    ],

    TopAffiliateUsersResponse: {
      ok: true,
      statusCode: 200,
      message: "OK",
      body: {
        topAffiliates: [
          {
            id: 1,
            full_name: "John Doe",
            email: "johndoe@example.com",
            verification_status: true,
            total_referrals: 500,
            tier_level: 3,
            registration_date: "2023-01-15T10:30:00Z",
          },
          {
            id: 2,
            full_name: "Jane Smith",
            email: "janesmith@example.com",
            verification_status: true,
            total_referrals: 450,
            tier_level: 3,
            registration_date: "2023-02-20T12:45:00Z",
          },
          {
            id: 3,
            full_name: "Mark Johnson",
            email: "markjohnson@example.com",
            verification_status: true,
            total_referrals: 400,
            tier_level: 2,
            registration_date: "2023-03-25T14:00:00Z",
          },
        ],
      },
    },

    SupportMessageResponse: {
      ok: true,
      message: "Support message received.",
      statusCode: 200,
      body: {
        acknowledgment:
          "Thank you for reaching out! Our customer support team will get back to you shortly.",
      },
      token: {
        accessToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoiYWNjZXNzIiwicmVmX2lkIjoiMjQiLCJzdWIiOiJVU0VSLTQ1IiwiaWF0IjoxNzI1MTQ4ODAwLCJleHAiOjE3Mjc3NDA3OTksImlzcyI6ImdyYW5kZ2FsZS5jb20ifQ.4gGZ4TxEGm5fhP5RdZHZmVZL7q3c",
        refreshToken:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6IlVTRVItNDUiLCJpYXQiOjE3MjUxNDg4MDAsImV4cCI6MTcyNzc0MDc5OSwiaXNzIjoiZ3JhbmRnYWxlLmNvbSJ9.O1QuXz7cCkYJ-EFh7ZlxnDxtIKzDjlU3GfHrq5X9Kt8",
      },
    },

    SupportMessageRequest: {
      email: "user@example.com",
      message: "I need help with my account.",
    },
    PinTickerPayload: {
      symbol: "00-USD",
      full_data: {
        ticker: "X:00USD",
        name: "00 Token - United States dollar",
        market: "crypto",
        locale: "global",
        active: true,
        currency_symbol: "USD",
        currency_name: "United States dollar",
        base_currency_symbol: "00",
        base_currency_name: "00 Token",
        last_updated_utc: "2017-01-01T00:00:00Z",
      },
    },
    ListPinnedTickersResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        tickers: [
          {
            id: 5,
            user_id: "5b4bcc93-6628-47d0-bfba-a9464ce735bd",
            created_at: "2024-12-19T19:35:32.689Z",
            updated_at: "2024-12-19T19:35:32.689Z",
            symbol: "00-USD",
            full_data: {
              name: "00 Token - United States dollar",
              active: true,
              locale: "global",
              market: "crypto",
              ticker: "X:00USD",
              currency_name: "United States dollar",
              currency_symbol: "USD",
              last_updated_utc: "2017-01-01T00:00:00Z",
              base_currency_name: "00 Token",
              base_currency_symbol: "00",
            },
          },
        ],
      },
    },
    ListTickersResponse: {
      ok: true,
      status: 200,
      message: "Request Successful",
      body: {
        tickers: [
          {
            ticker: "X:00USD",
            name: "00 Token - United States dollar",
            market: "crypto",
            locale: "global",
            active: true,
            currency_symbol: "USD",
            currency_name: "United States dollar",
            base_currency_symbol: "00",
            base_currency_name: "00 Token",
            last_updated_utc: "2017-01-01T00:00:00Z",
          },
          {
            ticker: "X:1INCHUSD",
            name: "1inch - United States dollar",
            market: "crypto",
            locale: "global",
            active: true,
            currency_symbol: "USD",
            currency_name: "United States dollar",
            base_currency_symbol: "1INCH",
            base_currency_name: "1inch",
            last_updated_utc: "2017-01-01T00:00:00Z",
          },
        ],
      },
    },
    InitFundWalletPayload: {
      amount: 50,
      crpto_currency: "btc",
    },
    InitFundWalletResponse: {
      ok: true,
      message: "Request successful.",
      status: 200,
      body: {
        transaction: {
          id: 44,
          ref: "5184672575",
          wallet_id: 3,
          user_id: "94b34bd3-de31-48d2-90b7-c0e8cbb12ccf",
          amount: "50.00",
          type: "credit",
          status: "pending",
          livemode: true,
          desc: "Fund wallet with USD50 using btc",
          metadata:
            '{"payment_id":"5184672575","payment_status":"waiting","pay_address":"3MFfJhfC2jGut3oExpVt6XLcR32jGVXRa7","price_amount":50,"price_currency":"usd","pay_amount":0.00050976,"amount_received":48.302741,"pay_currency":"btc","order_id":null,"order_description":"Wallet funding of USD50 from 0 using btc","payin_extra_id":null,"ipn_callback_url":null,"customer_email":null,"created_at":"2025-02-12T23:16:19.948Z","updated_at":"2025-02-12T23:16:19.948Z","purchase_id":"5611424752","smart_contract":null,"network":"btc","network_precision":null,"time_limit":null,"burning_percent":null,"expiration_estimate_date":"2025-02-12T23:36:19.948Z","is_fixed_rate":false,"is_fee_paid_by_user":false,"valid_until":"2025-02-19T23:16:19.948Z","type":"crypto2crypto","product":"api","origin_ip":"105.112.113.149"}',
          updated_at: "2025-02-12T23:16:19.449Z",
          created_at: "2025-02-12T23:16:19.449Z",
          payment_methods: null,
        },
      },
    },
    InitPayoutPayload: {
      amount_in_usd: 2,
      crypto_currency: "btc",
      wallet_address: "gufogewyfiuowehifgiyvwef",
    },
    InitPayoutResponse: {
      id: "5000000713",
      withdrawals: [
        {
          is_request_payouts: false,
          id: "5000000000",
          address: "TEmGwPeRTPiLFLVfBxXkSP91yc5GMNQhfS",
          currency: "trx",
          amount: "200",
          batch_withdrawal_id: "5000000000",
          ipn_callback_url: "https://nowpayments.io",
          status: "WAITING",
          extra_id: null,
          hash: null,
          error: null,
          payout_description: null,
          unique_external_id: null,
          created_at: "2020-11-12T17:06:12.791Z",
          requested_at: null,
          updated_at: null,
        },
      ],
    },

    SumSubWebhookPayload: {
      event: "applicant.statusChanged",
      payload: {
        applicantId: "b134f12e-983e-4b7f-b77d-d4c983a9cf44",
        status: "verified",
        reason: "All documents are valid",
      },
    },

    SubmitKYCPayload: {
      document_type:
        "Passport" | "DriverLicense" | "NationalId" | "ResidencePermit",
      frontFile: "string",
      backFile: "string",
    },

    SubmitKYCResponse: {
      ok: true,
      message: "KYC submitted successfully",
      status: 201,
      body: {
        kyc: {
          id: "abcd1234-efgh-5678-ijkl-9012mnop3456",
          user_id: "user-uuid",
          document_type: "Passport",
          front_file_url: "https://cdn.example.com/kyc/front.jpg",
          back_file_url: "https://cdn.example.com/kyc/back.jpg",
          status: "pending",
          created_at: "2025-04-19T10:00:00.000Z",
          updated_at: "2025-04-19T10:00:00.000Z",
        },
      },
    },

    GetUserKYCResponse: {
      ok: true,
      message: "KYC data retrieved successfully",
      status: 200,
      body: {
        kyc: {
          id: "abcd1234-efgh-5678-ijkl-9012mnop3456",
          user_id: "user-uuid",
          document_type: "Passport",
          front_file_url: "https://cdn.example.com/kyc/front.jpg",
          back_file_url: "https://cdn.example.com/kyc/back.jpg",
          status: "pending" | "verified" | "rejected",
          rejection_reason: null,
          created_at: "2025-04-19T10:00:00.000Z",
          updated_at: "2025-04-19T10:00:00.000Z",
        },
      },
    },

    GetAllKYCsResponse: {
      ok: true,
      message: "All KYCs retrieved successfully",
      status: 200,
      body: {
        kycs: [
          {
            id: "abcd1234-efgh-5678-ijkl-9012mnop3456",
            user: {
              id: "user-uuid",
              first_name: "Jane",
              last_name: "Doe",
              email: "jane@example.com",
            },
            document_type: "Passport",
            front_file_url: "https://cdn.example.com/kyc/front.jpg",
            back_file_url: "https://cdn.example.com/kyc/back.jpg",
            status: "pending" | "verified" | "rejected",
            rejection_reason: null,
            created_at: "2025-04-19T10:00:00.000Z",
            updated_at: "2025-04-19T10:00:00.000Z",
          },
        ],
      },
    },

    VerifyKYCResponse: {
      ok: true,
      message: "KYC verified successfully",
      status: 200,
      body: {
        kyc: {
          id: "abcd1234-efgh-5678-ijkl-9012mnop3456",
          status: "verified",
          updated_at: "2025-04-19T11:00:00.000Z",
        },
      },
    },

    RejectKYCResponse: {
      ok: true,
      message: "KYC rejected successfully",
      status: 200,
      body: {
        kyc: {
          id: "abcd1234-efgh-5678-ijkl-9012mnop3456",
          status: "rejected",
          rejection_reason: "Invalid document clarity",
          updated_at: "2025-04-19T11:05:00.000Z",
        },
      },
    },

    DeleteKYCResponse: null,
  },
};

const outputFile = "./swagger-output-0044556661.json";
const routes = ["./src/app.ts"];

swaggerAutogen(outputFile, routes, doc);
