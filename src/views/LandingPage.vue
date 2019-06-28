<template>
  <div id="landing-page">
    <div class="div-out">
      <div class="div-in" />
    </div>

    <div class="header">
      <div class="menu d-none d-sm-block">
        <a href="#about">ABOUT</a>
        <a href="#team">TEAM</a>
        <a href="#supporters">SUPPORTERS</a>
        <router-link
          to="/register"
          class="highlight-blue"
        >SIGN UP</router-link>
        <router-link
          :to="{name: 'login'}"
          class="highlight-blue"
        >
          SIGN IN
        </router-link>
      </div>
    </div>

    <br>

    <div class="container">
      <br>
      <div class="logo-landing" />
      <h1 class="text-center display-4">
        Welcome to Lemonade <span class="logo" />
      </h1>
      <p class="text-center lead">
        Live Exploration and Mining Of a Non-trivial Amount of Data from Everywhere
      </p>
      <div class="d-inline-flex top-login">
        <form
          class="form-inline"
          @submit.prevent="login"
        >
          <div class="form-group mx-sm-2 mb-2">
            <label
              for="email"
              class="sr-only"
            >Email</label>
            <input
              v-model="email"
              :placeholder="$t('common.email')"
              required
              type="email"
              class="form-control"
              autofocus=""
            >
          </div>
          <div class="form-group mx-sm-2 mb-2">
            <label
              for="password"
              class="sr-only"
            >Password</label>
            <input
              :type="showingPassword ? 'text' : 'password'"
              v-model="password"
              :placeholder="$t('common.password')"
              class="form-control"
              required
              style="padding-right: 60px;"
            >
            <div
              class="show-password btn btn-primary btn btn-sm"
              @click="showingPassword = !showingPassword"
              v-text="passwordShowText"
            />
          </div>
          <button
            type="submit"
            class="btn btn-primary mb-2"
          >{{ $t('common.login') }}</button>
        </form>

      </div>
      <div class="text-center">
        {{ $t('common.dontHaveAccount') }}
        <router-link to="/register">{{ $t('common.createAccount') }}</router-link>
      </div>

      <br>

      <h3
        id="about"
        class="text-center title"
      >
        About Lemonade
      </h3>

      <p class="text-center">
        Data analytics is a concept related to pattern and relevant knowledge discovery from large amounts of
        data. In feneral, the task is complex and demands knowledge in very specific areas, such as massive data
        processing and parallel programming languages. However, analysts are usually not versed in Computer
        Science, but in the original data domain. In order to support them in such analysis, we present
        <strong>Lemonade</strong> - Live Exploration and Mining Of a Non-trivial Amount of Data from Everywhere
        - A Platform for visual creation and execution of data analysis workflow
      </p>

      <br>
      <br>

      <div class="row">
        <div class="col-sm-6 col-lg-3">
          <div class="text-center">
            <svg
              width="487pt"
              height="487pt"
              viewBox="0 -4 487.23412 487"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m392.04 304.12c-48.602 0-88 39.398-88 88 0 48.602 39.398 88 88 88 48.602 0 88-39.398 88-88-0.058594-48.578-39.422-87.941-88-88zm0 160c-39.766 0-72-32.234-72-72 0-39.766 32.234-72 72-72s72 32.234 72 72c-0.042969 39.746-32.254 71.957-72 72z" />
              <path d="m168.04 304.12h-72v-84.688l23.602 23.598c3.1367 3.0352 8.1289 2.9883 11.215-0.097656 3.0859-3.082 3.1289-8.0742 0.097656-11.211l-37.258-37.258c-3.125-3.1211-8.1875-3.1211-11.312 0l-37.254 37.258c-3.0312 3.1367-2.9883 8.1289 0.097657 11.211 3.0859 3.0859 8.0742 3.1328 11.215 0.097656l23.598-23.598v84.688h-72c-4.418 0-8 3.582-8 8v160c0 4.418 3.582 8 8 8h160c4.418 0 8-3.582 8-8v-160c0-4.418-3.582-8-8-8zm-8 160h-144v-144h144z" />
              <path d="m240.45 45.203c-2.0117-2.0781-4.9844-2.9102-7.7812-2.1797-2.7969 0.73047-4.9805 2.918-5.7148 5.7148-0.73047 2.7969 0.10156 5.7695 2.1836 7.7773l23.598 23.602h-77.094c-4.2773-46.848-44.645-82.051-91.641-79.91s-83.996 40.867-83.996 87.91c0 47.043 37 85.77 83.996 87.91s87.363-33.062 91.641-79.91h77.094l-23.598 23.602c-2.082 2.0078-2.9141 4.9805-2.1836 7.7773 0.73438 2.7969 2.918 4.9805 5.7148 5.7148 2.7969 0.73047 5.7695-0.10156 7.7812-2.1836l37.254-37.254c3.125-3.125 3.125-8.1875 0-11.312zm-152.4 114.91c-39.766 0-72-32.234-72-72 0-39.766 32.234-72 72-72s72 32.234 72 72c-0.042969 39.746-32.254 71.957-72 72z" />
              <path d="m484.3 81.926-87.203-71.199c-2.9453-2.4102-7.1797-2.4102-10.125 0l-87.199 71.199c-1.8594 1.5195-2.9375 3.793-2.9375 6.1914 0 2.3984 1.0781 4.6719 2.9375 6.1914l84.27 68.801v97.695l-23.598-23.602c-3.1406-3.0312-8.1289-2.9883-11.215 0.097656-3.0859 3.0859-3.1289 8.0781-0.097657 11.215l37.254 37.258c3.125 3.1211 8.1875 3.1211 11.312 0l37.258-37.258c3.0312-3.1367 2.9883-8.1289-0.097656-11.215-3.0859-3.0859-8.0781-3.1289-11.215-0.097656l-23.602 23.602v-97.695l84.258-68.801c1.8555-1.5195 2.9336-3.793 2.9336-6.1914 0-2.3984-1.0781-4.6719-2.9336-6.1914zm-92.258 67.055-74.543-60.863 74.543-60.863 74.543 60.863z" />
            </svg>

          </div>
          <h5 class="text-center">Create a Processing Workflow</h5>
          <p class="text-center">You can create and cutomize workflows from scratch! There are several
          operations and filters available so you can manipulate your data by simply adding functionality
          boxes to your workflow with an easy drag-and-drop process.</p>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="text-center">
            <svg
              enable-background="new 0 0 413.184 413.184"
              version="1.1"
              viewBox="0 0 413.184 413.184"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m206.58 0c-103.01 0-183.7 34.79-183.7 79.213v43.236c0 44.406 80.692 79.197 183.7 79.197 103.01 0 183.71-34.79 183.71-79.197v-43.236c0-44.423-80.701-79.213-183.71-79.213zm167.46 122.44c0 37.091-88.244 62.94-167.46 62.94-79.197 0-167.44-25.849-167.44-62.94v-43.236c0-37.099 88.236-62.956 167.44-62.956s167.46 25.857 167.46 62.956v43.236z" />
              <path d="m31.015 173.99c-4.495 0-8.129 3.642-8.129 8.129v43.236c0 44.406 80.692 79.197 183.7 79.197 103.01 0 183.71-34.79 183.71-79.197v-43.236c0-4.487-3.633-8.129-8.129-8.129-4.495 0-8.129 3.642-8.129 8.129v43.236c0 37.091-88.244 62.94-167.46 62.94-79.197 0-167.44-25.849-167.44-62.94v-43.236c1e-3 -4.487-3.632-8.129-8.127-8.129z" />
              <path d="m22.886 334c0 44.406 80.692 79.189 183.7 79.189 103.01 0 183.71-34.782 183.71-79.189v-43.236c0-4.487-3.633-8.129-8.129-8.129-4.495 0-8.129 3.642-8.129 8.129v43.236c0 37.083-88.244 62.931-167.46 62.931-79.197 0-167.44-25.849-167.44-62.931v-43.236c0-4.487-3.633-8.129-8.129-8.129s-8.129 3.642-8.129 8.129c2e-3 0 2e-3 43.236 2e-3 43.236z" />
            </svg>
          </div>
          <h5 class="text-center">
            Import, Export or Manage Datasets
          </h5>
          <p class="text-center">
            All your data can be imported in different formats to the application for proper manipulation.
            You can manage the imported datasets and later on you can export the resulting data with the
            formats of your choice.
          </p>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="text-center">
            <svg
              height="380pt"
              viewBox="-68 0 380 380.24835"
              width="380pt"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m6.949219 380.25c-1.539063 0-3.070313-.519531-4.339844-1.558594-2.61328125-2.148437-3.25-5.894531-1.503906-8.792968l95.386719-158.273438h-56.179688c-2.730469 0-5.195312-1.625-6.273438-4.132812-1.074218-2.507813-.554687-5.417969 1.324219-7.394532l188.054688-197.972656c2.292969-2.425781 6.011719-2.816406 8.773437-.953125 2.757813 1.871094 3.765625 5.464844 2.378906 8.5l-67.566406 147.339844h71.28125c2.820313 0 5.355469 1.738281 6.367188 4.371093 1.019531 2.632813.308594 5.621094-1.78125 7.515626l-231.335938 209.582031c-1.300781 1.175781-2.9375 1.769531-4.585937 1.769531zm49.261719-182.277344h52.367187c2.457031 0 4.730469 1.324219 5.945313 3.46875 1.207031 2.144532 1.175781 4.773438-.101563 6.878906l-77.6875 128.902344 183.847656-166.558594h-64.21875c-2.328125 0-4.496093-1.183593-5.746093-3.140624-1.253907-1.957032-1.429688-4.421876-.460938-6.535157l54.898438-119.714843zm0 0" />
            </svg>
          </div>
          <h5 class="text-center">
            Execute and Manage Existing Workflows
          </h5>
          <p class="text-center">
            All your workflows are manageable, so you can access, create, edit or delete them at any time.
            You can also follow the progress of a workflow that is being executed and pause or stop it if
            you want.
          </p>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="text-center">
            <svg
              width="512pt"
              height="512pt"
              viewBox="0 -15 512.00002 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m68.926 246.8h-61.32c-4.1992 0-7.6055 3.4023-7.6055 7.6016v220.21c0 4.1992 3.4062 7.6055 7.6055 7.6055h61.32c4.1992 0 7.6055-3.4062 7.6055-7.6055v-69.492c0-4.1992-3.4062-7.6016-7.6055-7.6016s-7.6016 3.4023-7.6016 7.6016v61.891h-46.117v-205h46.117v117.77c0 4.2031 3.4023 7.6055 7.6016 7.6055s7.6055-3.4023 7.6055-7.6055v-125.37c0-4.1992-3.4062-7.6016-7.6055-7.6016z" />
              <path d="m177.79 317.56h-61.32c-4.1992 0-7.6055 3.4023-7.6055 7.6016v149.45c0 4.1992 3.4062 7.6055 7.6055 7.6055h61.32c4.2031 0 7.6055-3.4062 7.6055-7.6055v-149.45c0-4.1992-3.4023-7.6016-7.6055-7.6016zm-7.6016 149.45h-46.117v-134.24h46.117z" />
              <path d="m286.66 199.62h-61.324c-4.1992 0-7.6055 3.4023-7.6055 7.6016v267.39c0 4.1992 3.4062 7.6055 7.6055 7.6055h61.324c4.1992 0 7.6016-3.4062 7.6016-7.6055v-267.39c0-4.1992-3.4023-7.6016-7.6016-7.6016zm-7.6055 267.39h-46.117v-252.18h46.117z" />
              <path d="m395.53 235.01h-61.324c-4.1992 0-7.6055 3.4023-7.6055 7.6016v232c0 4.1992 3.4062 7.6055 7.6055 7.6055h61.324c4.1992 0 7.6016-3.4062 7.6016-7.6055v-232c0-4.1992-3.4023-7.6016-7.6016-7.6016zm-7.6055 232h-46.117v-216.8h46.117z" />
              <path d="m504.39 128.86h-61.32c-4.1992 0-7.6055 3.4023-7.6055 7.6016v100.36c0 4.1992 3.4062 7.6055 7.6055 7.6055s7.6016-3.4062 7.6016-7.6055v-92.75h46.117v322.94h-46.117v-204.84c0-4.1992-3.4023-7.6055-7.6016-7.6055s-7.6055 3.4062-7.6055 7.6055v212.44c0 4.1992 3.4062 7.6055 7.6055 7.6055h61.32c4.1992 0 7.6055-3.4062 7.6055-7.6055v-338.15c0-4.1992-3.4062-7.6016-7.6055-7.6016z" />
              <path d="m452.2 69.875c6.1406 4.1953 13.559 6.6562 21.539 6.6562 21.102 0 38.266-17.168 38.266-38.266 0-21.102-17.164-38.266-38.266-38.266s-38.266 17.164-38.266 38.266c0 7.6289 2.2539 14.738 6.1172 20.715l-55.184 53.816c-6.1367-4.1953-13.555-6.6523-21.535-6.6523-14.262 0-26.715 7.8477-33.297 19.445l-37.562-12.199c0.16406-1.4336 0.25781-2.8867 0.25781-4.3633 0-21.098-17.168-38.266-38.266-38.266-21.102 0-38.266 17.168-38.266 38.266 0 8.3516 2.6992 16.086 7.2578 22.383l-58.016 62.848c-5.7891-3.5234-12.586-5.5586-19.844-5.5586-10.672 0-20.332 4.3945-27.277 11.465l-46.012-29.902c1.7266-4.3555 2.6875-9.0977 2.6875-14.059 0-21.102-17.168-38.266-38.27-38.266-21.098 0-38.262 17.164-38.262 38.266 0 21.098 17.164 38.266 38.266 38.266 10.672 0 20.332-4.3984 27.281-11.469l46.008 29.902c-1.7266 4.3555-2.6875 9.0977-2.6875 14.062 0 21.102 17.168 38.266 38.266 38.266 21.102 0 38.27-17.164 38.27-38.266 0-8.3516-2.6992-16.082-7.2578-22.383l58.016-62.848c5.7891 3.5273 12.582 5.5586 19.844 5.5586 14.258 0 26.715-7.8477 33.297-19.445l37.559 12.199c-0.16406 1.4336-0.25391 2.8867-0.25391 4.3633 0 21.102 17.164 38.266 38.266 38.266 21.102 0 38.266-17.164 38.266-38.266 0-7.6328-2.2539-14.742-6.1172-20.715zm-413.93 109.39c-12.715 0-23.059-10.344-23.059-23.059s10.344-23.059 23.059-23.059 23.059 10.344 23.059 23.059-10.344 23.059-23.059 23.059zm108.87 70.762c-12.715 0-23.059-10.344-23.059-23.059s10.344-23.059 23.059-23.059c12.715 0 23.059 10.344 23.059 23.059s-10.344 23.059-23.059 23.059zm108.87-117.94c-12.715 0-23.059-10.344-23.059-23.059s10.344-23.059 23.059-23.059 23.059 10.344 23.059 23.059-10.344 23.059-23.059 23.059zm217.73-116.88c12.715 0 23.059 10.344 23.059 23.059s-10.344 23.059-23.059 23.059-23.059-10.344-23.059-23.059 10.344-23.059 23.059-23.059zm-108.87 152.26c-12.715 0-23.059-10.34-23.059-23.055s10.344-23.059 23.059-23.059c12.715 0 23.059 10.344 23.059 23.059s-10.344 23.055-23.059 23.055z" />
            </svg>
          </div>
          <h5 class="text-center">
            Data Visualization
          </h5>
          <p class="text-center">
            At the end of the process, you have features avaiable for a better visualization of the data,
            abstracting its schematic information into graphs and other visual forms.
          </p>
        </div>
      </div>

      <h3
        id="team"
        class="text-center title"
      >
        Meet our team
      </h3>

      <div class="row">
        <div class="col-sm">
          <ul class="text-center">
            <li><b>PRINCIPAL INVESTIGATORS</b></li>
            <li>Adriano Cesar Machado Pereira</li>
            <li>Adriano Alonso Veloso</li>
            <li>Clodoveu Alves Davis Jr.</li>
            <li>Dorgival Guedes Neto</li>
            <li>Gisele Lobo Pappa</li>
            <li>Humberto Torres Marques Neto</li>
            <li>Leandro Balby Marinho</li>
            <li>Loic Cerf</li>
            <li>Marco Vieira</li>
            <li>Nazareno Andrade</li>
            <li>Nuno Antunes</li>
            <li>Raquel Cardoso Melo Minardi</li>
            <li>Regina Moraes</li>
            <li>Renato Antonio Celso Ferreira</li>
            <li>Wagner Meira Jr.</li>
          </ul>
        </div>
        <div class="col-sm">
          <ul class="text-center">
            <li><b>RESEARCHERS AND DEVELOPERS</b></li>
            <li>Fernando Carvalho</li>
            <li>Geraldo Franciscani</li>
            <li>Gustavo Avelar</li>
            <li>Israel Guerra de Moura</li>
            <li>João Víctor Bárbara</li>
            <li>Lucas Ponce</li>
            <li>Matheus Gonçalves</li>
            <li>Michel Boaventura</li>
            <li>Pedro Nascimento</li>
            <li>Saulo Antunes Silva</li>
            <li>Tania Basso</li>
            <li>Vinícius Dias</li>
            <li>Walter dos Santos Filho</li>
            <li>Yuri Carvalho Pains</li>
            <li>Zilton Júnior</li>
          </ul>
        </div>
      </div>

      <h3
        id="supporters"
        class="text-center title"
      >
        Our supporters
      </h3>

      <div class="row supporters">
        <div class="col-md m-4">
          <a href="http://www.eubra-bigsea.eu/">
            <img src="/landing-page/bigsea.png">
          </a>
        </div>
        <div class="col-md m-4">
          <a href="http://www.inweb.org.br/">
            <img src="/landing-page/inweb.png">
          </a>
        </div>
        <div class="col-md m-4">
          <a href="http://www.citc.rnp.br/">
            <img src="/landing-page/ctic.png">
          </a>
        </div>
      </div>
      <div class="row supporters">
        <div class="col-md m-4">
          <a href="http://www.rnp.br/">
            <img src="/landing-page/rnp.png">
          </a>
        </div>
        <div class="col-md m-4">
          <a href="http://www.ceweb.br/">
            <img src="/landing-page/ceweb.png">
          </a>
        </div>
        <div class="col-md m-4">
          <a href="http://www.nic.br/">
            <img src="/landing-page/nic.png">
          </a>
        </div>
      </div>
      <div class="row supporters">
        <div class="col-md m-4">
          <a href="http://www.cnpq.br/">
            <img src="/landing-page/cnpq.png">
          </a>
        </div>
        <div class="col-md m-4">
          <a href="http://www.capes.br/">
            <img src="/landing-page/capes.png">
          </a>
        </div>
        <div class="col-md m-4">
          <a href="http://www.fapemig.br/">
            <img src="/landing-page/fapemig.png">
          </a>
        </div>
      </div>
      <div class="row supporters">
        <div class="col-md m-4">
          <a href="http://www.atmosphere-eubrazil.eu/">
            <img src="/landing-page/atmosphere.png">
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
body {
  background-color: white !important;
}

#landing-page .logo-landing {
  background: url('/logo.png');
  width: 64px;
  height: 64px;
  float: left;
  background-size: auto 64px;
}

#landing-page ul {
  list-style: none;
  padding: 0;
}

#landing-page .header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 75px;
}

#landing-page .menu {
  display: flex;
  justify-content: space-between;
  text-transform: uppercase;
}

#landing-page .menu a {
  margin: 0 10px;
}

#landing-page .disabled {
  opacity: 0.5;
}

#landing-page .disabled p {
  display: none;
}

#landing-page .nav-link {
  width: 16px;
  height: 16px;
  padding: 0;
  margin-bottom: 16px;
  background-color: #ccc;
  border-radius: 100% !important;
}

#landing-page .nav-link.active {
  background-color: #ffca26 !important;
}

#landing-page .supporters div {
  text-align: center;
}

#landing-page .supporters img {
  max-height: 60px;
  max-width: 100%;
  vertical-align: middle;
}

#landing-page .enter {
  background-color: #fff !important;
  border: 0;
  outline: none;
  border-radius: 4px 4px 4px 4px;
  color: #77b454;
  font-weight: 600;
  height: 32px;
  margin: 0;
  padding: 8px 16px;
  text-decoration: none;
  box-shadow: -1px 1px 4px #eee;
  line-height: 16px;
  transition: all 0.3s;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08),
    0 1px 3px 1px rgba(60, 64, 67, 0.16);
}

#landing-page .enter:hover {
  text-decoration: none;
}

#landing-page h3 {
  text-transform: uppercase;
  margin-top: 40px;
  margin-bottom: 30px;
}

#landing-page .div-out {
  position: absolute;
  left: 0;
  height: 400px;
  width: 50%;
  min-width: 500px;
  background-image: linear-gradient(-56.47deg, #77b454, #f4f800);
  overflow: hidden;
  float: right;
  z-index: -1;
}

#landing-page .div-in {
  display: block;
  position: relative;
  height: 100%;
  width: 110%;
  min-width: 580px;
  background-color: white;
  border-radius: 100% 100px 0 0;
}

#landing-page svg {
  width: 36px !important;
  height: 36px !important;
  fill: #007bff !important;
  text-align: center;
  margin-bottom: 10px;
}

#landing-page .header .menu a {
  text-decoration: none;
  color: #212529 !important;
}

#landing-page .header .menu a.highlight-blue {
  color: #007bff !important;
}

#landing-page .top-login {
  width: 100%;
  justify-content: center;
}

#landing-page .show-password {
  padding: 2px 7px;
  font-size: 12px;
  cursor: pointer;
  margin-left: -55px;
}
</style>

<script>
export default {
  name: 'LandingPage',
  data () {
    return {
      email: '',
      password: '',
      rememberPassword: false,
      showingPassword: false
    };
  },
  computed: {
    passwordShowText () {
      return this.$t(this.showingPassword ? 'common.hide' : 'common.show');
    }
  },
  methods: {
    login: function () {
      let self = this;
      let thornUrl = process.env.VUE_APP_THORN_URL;
      let email = this.email;
      let password = this.password;
      this.$store
        .dispatch('login', { thornUrl, user: { email, password } })
        .then(() => this.$router.push('/home'))
        .catch(err => {
          let msg = err.message.startsWith('errors.')
            ? self.$t(err.message)
            : err.message;
          self.$snotify.error(msg, self.$t('titles.error'));
        });
    }
  }
};
</script>