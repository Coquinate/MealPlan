export { default as roCommon } from './ro/common.json';
export { default as roAuth } from './ro/auth.json';
export { default as roMeals } from './ro/meals.json';
export { default as roShopping } from './ro/shopping.json';
export { default as roAdmin } from './ro/admin.json';
export { default as roRecipes } from './ro/recipes.json';
export { default as roSettings } from './ro/settings.json';
export { default as enCommon } from './en/common.json';
export { default as enAuth } from './en/auth.json';
export { default as enMeals } from './en/meals.json';
export { default as enShopping } from './en/shopping.json';
export { default as enAdmin } from './en/admin.json';
export { default as enRecipes } from './en/recipes.json';
export { default as enSettings } from './en/settings.json';
export declare const resources: {
  ro: {
    common: () => Promise<{
      default: {
        button: {
          save: string;
          cancel: string;
          delete: string;
          edit: string;
          add: string;
          submit: string;
          close: string;
          back: string;
          next: string;
          previous: string;
          confirm: string;
          loading: string;
        };
        label: {
          required: string;
          optional: string;
          search: string;
          filter: string;
          sort: string;
          actions: string;
          status: string;
          date: string;
          time: string;
          name: string;
          description: string;
          select: string;
        };
        message: {
          loading: string;
          error: string;
          success: string;
          noData: string;
          notFound: string;
          unauthorized: string;
          forbidden: string;
          serverError: string;
        };
        time: {
          today: string;
        };
        dayOfWeek: {
          monday: string;
          tuesday: string;
          wednesday: string;
          thursday: string;
          friday: string;
          saturday: string;
          sunday: string;
        };
        mealType: {
          breakfast: string;
          lunch: string;
          dinner: string;
          snack: string;
        };
        landing: {
          welcome_message: string;
          coming_soon: string;
          login_button: string;
          tagline: string;
          system_ready: string;
          feature1: {
            title: string;
            description: string;
          };
          feature2: {
            title: string;
            description: string;
          };
          feature3: {
            title: string;
            description: string;
          };
        };
        health: {
          status_connected: string;
          status_disconnected: string;
          status_degraded: string;
          checking: string;
        };
      };
      button: {
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        add: string;
        submit: string;
        close: string;
        back: string;
        next: string;
        previous: string;
        confirm: string;
        loading: string;
      };
      label: {
        required: string;
        optional: string;
        search: string;
        filter: string;
        sort: string;
        actions: string;
        status: string;
        date: string;
        time: string;
        name: string;
        description: string;
        select: string;
      };
      message: {
        loading: string;
        error: string;
        success: string;
        noData: string;
        notFound: string;
        unauthorized: string;
        forbidden: string;
        serverError: string;
      };
      time: {
        today: string;
      };
      dayOfWeek: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
      };
      mealType: {
        breakfast: string;
        lunch: string;
        dinner: string;
        snack: string;
      };
      landing: {
        welcome_message: string;
        coming_soon: string;
        login_button: string;
        tagline: string;
        system_ready: string;
        feature1: {
          title: string;
          description: string;
        };
        feature2: {
          title: string;
          description: string;
        };
        feature3: {
          title: string;
          description: string;
        };
      };
      health: {
        status_connected: string;
        status_disconnected: string;
        status_degraded: string;
        checking: string;
      };
    }>;
    auth: () => Promise<{
      default: {
        login: {
          title: string;
          email: string;
          password: string;
          submit: string;
          forgotPassword: string;
          noAccount: string;
          createAccount: string;
        };
        register: {
          title: string;
          name: string;
          email: string;
          password: string;
          confirmPassword: string;
          submit: string;
          hasAccount: string;
          backToLogin: string;
        };
        errors: {
          invalidCredentials: string;
          emailRequired: string;
          passwordRequired: string;
          passwordTooShort: string;
          passwordMismatch: string;
          emailExists: string;
          registrationFailed: string;
          loginFailed: string;
        };
      };
      login: {
        title: string;
        email: string;
        password: string;
        submit: string;
        forgotPassword: string;
        noAccount: string;
        createAccount: string;
      };
      register: {
        title: string;
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        submit: string;
        hasAccount: string;
        backToLogin: string;
      };
      errors: {
        invalidCredentials: string;
        emailRequired: string;
        passwordRequired: string;
        passwordTooShort: string;
        passwordMismatch: string;
        emailExists: string;
        registrationFailed: string;
        loginFailed: string;
      };
    }>;
    meals: () => Promise<{
      default: {
        title: string;
        weekView: {
          title: string;
          today: string;
          tomorrow: string;
          yesterday: string;
        };
        mealCard: {
          breakfast: string;
          lunch: string;
          dinner: string;
          snack: string;
          servings: string;
          servings_other: string;
          cookTime: string;
          addMeal: string;
          editMeal: string;
          removeMeal: string;
        };
        planning: {
          addToWeek: string;
          removeFromWeek: string;
          moveMeal: string;
          duplicateMeal: string;
        };
      };
      title: string;
      weekView: {
        title: string;
        today: string;
        tomorrow: string;
        yesterday: string;
      };
      mealCard: {
        breakfast: string;
        lunch: string;
        dinner: string;
        snack: string;
        servings: string;
        servings_other: string;
        cookTime: string;
        addMeal: string;
        editMeal: string;
        removeMeal: string;
      };
      planning: {
        addToWeek: string;
        removeFromWeek: string;
        moveMeal: string;
        duplicateMeal: string;
      };
    }>;
    shopping: () => Promise<{
      default: {
        title: string;
        categories: {
          vegetables: string;
          fruits: string;
          meat: string;
          dairy: string;
          grains: string;
          spices: string;
          other: string;
        };
        item: {
          add: string;
          edit: string;
          delete: string;
          checked: string;
          unchecked: string;
          quantity: string;
          unit: string;
          markAs: string;
          markAsChecked: string;
          markAsUnchecked: string;
        };
        actions: {
          clearCompleted: string;
          checkAll: string;
          uncheckAll: string;
        };
        expiry: {
          today: string;
          tomorrow: string;
          days: string;
          daysCount: string;
        };
      };
      title: string;
      categories: {
        vegetables: string;
        fruits: string;
        meat: string;
        dairy: string;
        grains: string;
        spices: string;
        other: string;
      };
      item: {
        add: string;
        edit: string;
        delete: string;
        checked: string;
        unchecked: string;
        quantity: string;
        unit: string;
        markAs: string;
        markAsChecked: string;
        markAsUnchecked: string;
      };
      actions: {
        clearCompleted: string;
        checkAll: string;
        uncheckAll: string;
      };
      expiry: {
        today: string;
        tomorrow: string;
        days: string;
        daysCount: string;
      };
    }>;
    admin: () => Promise<{
      default: {
        title: string;
        navigation: {
          dashboard: string;
          recipes: string;
          mealPlans: string;
          users: string;
          settings: string;
        };
        recipes: {
          title: string;
          add: string;
          edit: string;
          delete: string;
          publish: string;
          unpublish: string;
        };
        mealPlans: {
          title: string;
          create: string;
          edit: string;
          delete: string;
          assign: string;
        };
      };
      title: string;
      navigation: {
        dashboard: string;
        recipes: string;
        mealPlans: string;
        users: string;
        settings: string;
      };
      recipes: {
        title: string;
        add: string;
        edit: string;
        delete: string;
        publish: string;
        unpublish: string;
      };
      mealPlans: {
        title: string;
        create: string;
        edit: string;
        delete: string;
        assign: string;
      };
    }>;
    recipes: () => Promise<{
      default: {
        title: string;
        details: {
          ingredients: string;
          instructions: string;
          nutrition: string;
          servings: string;
          prepTime: string;
          cookTime: string;
          totalTime: string;
          difficulty: string;
        };
        difficulty: {
          easy: string;
          medium: string;
          hard: string;
        };
        actions: {
          favorite: string;
          unfavorite: string;
          share: string;
          print: string;
          addToMealPlan: string;
        };
      };
      title: string;
      details: {
        ingredients: string;
        instructions: string;
        nutrition: string;
        servings: string;
        prepTime: string;
        cookTime: string;
        totalTime: string;
        difficulty: string;
      };
      difficulty: {
        easy: string;
        medium: string;
        hard: string;
      };
      actions: {
        favorite: string;
        unfavorite: string;
        share: string;
        print: string;
        addToMealPlan: string;
      };
    }>;
    settings: () => Promise<{
      default: {
        title: string;
        sections: {
          profile: string;
          preferences: string;
          household: string;
          notifications: string;
          privacy: string;
          subscription: string;
        };
        profile: {
          name: string;
          email: string;
          phone: string;
          avatar: string;
          save: string;
        };
        preferences: {
          language: string;
          timezone: string;
          dietary: string;
          allergies: string;
          cuisineTypes: string;
        };
        notifications: {
          email: string;
          push: string;
          mealReminders: string;
          shoppingReminders: string;
        };
      };
      title: string;
      sections: {
        profile: string;
        preferences: string;
        household: string;
        notifications: string;
        privacy: string;
        subscription: string;
      };
      profile: {
        name: string;
        email: string;
        phone: string;
        avatar: string;
        save: string;
      };
      preferences: {
        language: string;
        timezone: string;
        dietary: string;
        allergies: string;
        cuisineTypes: string;
      };
      notifications: {
        email: string;
        push: string;
        mealReminders: string;
        shoppingReminders: string;
      };
    }>;
  };
  en: {
    common: () => Promise<{
      default: {
        button: {
          save: string;
          cancel: string;
          delete: string;
          edit: string;
          add: string;
          submit: string;
          close: string;
          back: string;
          next: string;
          previous: string;
          confirm: string;
          loading: string;
        };
        label: {
          required: string;
          optional: string;
          search: string;
          filter: string;
          sort: string;
          actions: string;
          status: string;
          date: string;
          time: string;
          name: string;
          description: string;
          select: string;
        };
        message: {
          loading: string;
          error: string;
          success: string;
          noData: string;
          notFound: string;
          unauthorized: string;
          forbidden: string;
          serverError: string;
        };
        time: {
          today: string;
        };
        dayOfWeek: {
          monday: string;
          tuesday: string;
          wednesday: string;
          thursday: string;
          friday: string;
          saturday: string;
          sunday: string;
        };
        mealType: {
          breakfast: string;
          lunch: string;
          dinner: string;
          snack: string;
        };
        landing: {
          welcome_message: string;
          coming_soon: string;
          login_button: string;
          tagline: string;
          system_ready: string;
          feature1: {
            title: string;
            description: string;
          };
          feature2: {
            title: string;
            description: string;
          };
          feature3: {
            title: string;
            description: string;
          };
        };
        health: {
          status_connected: string;
          status_disconnected: string;
          status_degraded: string;
          checking: string;
        };
      };
      button: {
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        add: string;
        submit: string;
        close: string;
        back: string;
        next: string;
        previous: string;
        confirm: string;
        loading: string;
      };
      label: {
        required: string;
        optional: string;
        search: string;
        filter: string;
        sort: string;
        actions: string;
        status: string;
        date: string;
        time: string;
        name: string;
        description: string;
        select: string;
      };
      message: {
        loading: string;
        error: string;
        success: string;
        noData: string;
        notFound: string;
        unauthorized: string;
        forbidden: string;
        serverError: string;
      };
      time: {
        today: string;
      };
      dayOfWeek: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
      };
      mealType: {
        breakfast: string;
        lunch: string;
        dinner: string;
        snack: string;
      };
      landing: {
        welcome_message: string;
        coming_soon: string;
        login_button: string;
        tagline: string;
        system_ready: string;
        feature1: {
          title: string;
          description: string;
        };
        feature2: {
          title: string;
          description: string;
        };
        feature3: {
          title: string;
          description: string;
        };
      };
      health: {
        status_connected: string;
        status_disconnected: string;
        status_degraded: string;
        checking: string;
      };
    }>;
    auth: () => Promise<{
      default: {
        login: {
          title: string;
          email: string;
          password: string;
          submit: string;
          forgotPassword: string;
          noAccount: string;
          createAccount: string;
        };
        register: {
          title: string;
          name: string;
          email: string;
          password: string;
          confirmPassword: string;
          submit: string;
          hasAccount: string;
          backToLogin: string;
        };
        errors: {
          invalidCredentials: string;
          emailRequired: string;
          passwordRequired: string;
          passwordTooShort: string;
          passwordMismatch: string;
        };
      };
      login: {
        title: string;
        email: string;
        password: string;
        submit: string;
        forgotPassword: string;
        noAccount: string;
        createAccount: string;
      };
      register: {
        title: string;
        name: string;
        email: string;
        password: string;
        confirmPassword: string;
        submit: string;
        hasAccount: string;
        backToLogin: string;
      };
      errors: {
        invalidCredentials: string;
        emailRequired: string;
        passwordRequired: string;
        passwordTooShort: string;
        passwordMismatch: string;
      };
    }>;
    meals: () => Promise<{
      default: {
        title: string;
        weekView: {
          title: string;
          today: string;
          tomorrow: string;
          yesterday: string;
        };
        mealCard: {
          breakfast: string;
          lunch: string;
          dinner: string;
          snack: string;
          servings: string;
          servings_other: string;
          cookTime: string;
          addMeal: string;
          editMeal: string;
          removeMeal: string;
        };
        planning: {
          addToWeek: string;
          removeFromWeek: string;
          moveMeal: string;
          duplicateMeal: string;
        };
      };
      title: string;
      weekView: {
        title: string;
        today: string;
        tomorrow: string;
        yesterday: string;
      };
      mealCard: {
        breakfast: string;
        lunch: string;
        dinner: string;
        snack: string;
        servings: string;
        servings_other: string;
        cookTime: string;
        addMeal: string;
        editMeal: string;
        removeMeal: string;
      };
      planning: {
        addToWeek: string;
        removeFromWeek: string;
        moveMeal: string;
        duplicateMeal: string;
      };
    }>;
    shopping: () => Promise<{
      default: {
        title: string;
        categories: {
          vegetables: string;
          fruits: string;
          meat: string;
          dairy: string;
          grains: string;
          spices: string;
          other: string;
        };
        item: {
          add: string;
          edit: string;
          delete: string;
          checked: string;
          unchecked: string;
          quantity: string;
          unit: string;
        };
        actions: {
          clearCompleted: string;
          checkAll: string;
          uncheckAll: string;
        };
      };
      title: string;
      categories: {
        vegetables: string;
        fruits: string;
        meat: string;
        dairy: string;
        grains: string;
        spices: string;
        other: string;
      };
      item: {
        add: string;
        edit: string;
        delete: string;
        checked: string;
        unchecked: string;
        quantity: string;
        unit: string;
      };
      actions: {
        clearCompleted: string;
        checkAll: string;
        uncheckAll: string;
      };
    }>;
    admin: () => Promise<{
      default: {
        title: string;
        navigation: {
          dashboard: string;
          recipes: string;
          mealPlans: string;
          users: string;
          settings: string;
        };
        recipes: {
          title: string;
          add: string;
          edit: string;
          delete: string;
          publish: string;
          unpublish: string;
        };
        mealPlans: {
          title: string;
          create: string;
          edit: string;
          delete: string;
          assign: string;
        };
      };
      title: string;
      navigation: {
        dashboard: string;
        recipes: string;
        mealPlans: string;
        users: string;
        settings: string;
      };
      recipes: {
        title: string;
        add: string;
        edit: string;
        delete: string;
        publish: string;
        unpublish: string;
      };
      mealPlans: {
        title: string;
        create: string;
        edit: string;
        delete: string;
        assign: string;
      };
    }>;
    recipes: () => Promise<{
      default: {
        title: string;
        details: {
          ingredients: string;
          instructions: string;
          nutrition: string;
          servings: string;
          prepTime: string;
          cookTime: string;
          totalTime: string;
          difficulty: string;
        };
        difficulty: {
          easy: string;
          medium: string;
          hard: string;
        };
        actions: {
          favorite: string;
          unfavorite: string;
          share: string;
          print: string;
          addToMealPlan: string;
        };
      };
      title: string;
      details: {
        ingredients: string;
        instructions: string;
        nutrition: string;
        servings: string;
        prepTime: string;
        cookTime: string;
        totalTime: string;
        difficulty: string;
      };
      difficulty: {
        easy: string;
        medium: string;
        hard: string;
      };
      actions: {
        favorite: string;
        unfavorite: string;
        share: string;
        print: string;
        addToMealPlan: string;
      };
    }>;
    settings: () => Promise<{
      default: {
        title: string;
        sections: {
          profile: string;
          preferences: string;
          household: string;
          notifications: string;
          privacy: string;
          subscription: string;
        };
        profile: {
          name: string;
          email: string;
          phone: string;
          avatar: string;
          save: string;
        };
        preferences: {
          language: string;
          timezone: string;
          dietary: string;
          allergies: string;
          cuisineTypes: string;
        };
        notifications: {
          email: string;
          push: string;
          mealReminders: string;
          shoppingReminders: string;
        };
      };
      title: string;
      sections: {
        profile: string;
        preferences: string;
        household: string;
        notifications: string;
        privacy: string;
        subscription: string;
      };
      profile: {
        name: string;
        email: string;
        phone: string;
        avatar: string;
        save: string;
      };
      preferences: {
        language: string;
        timezone: string;
        dietary: string;
        allergies: string;
        cuisineTypes: string;
      };
      notifications: {
        email: string;
        push: string;
        mealReminders: string;
        shoppingReminders: string;
      };
    }>;
  };
};
//# sourceMappingURL=index.d.ts.map
