export async function getData(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

export async function postData(url, data) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error('Failed to send data');
    }

    const responseData = await res.json();
    return responseData;
}

//export const apiBaseUrl = process.env.REACT_APP_API_URL;
export const apiBaseUrl ='https://loproconnect-backend.vercel.app'

export const apiUrl = {
    courses: apiBaseUrl + '/courses',
    courseById: apiBaseUrl + '/courses/',
    courseTeacher: apiBaseUrl + '/courses/teacher/',
    tests: apiBaseUrl + '/tests',
    testsByCourse: apiBaseUrl + '/tests/course/',
    saveTestResults: apiBaseUrl + '/tests/save',
    users: apiBaseUrl + '/users',
    register: apiBaseUrl + '/users/register',
    login: apiBaseUrl + '/users/login',
    auth: apiBaseUrl + '/users/auth',
    usersAnswers: apiBaseUrl + '/users/answers/',
    usersTeacherStudents: apiBaseUrl + '/users/teacher/students/',
    teacherAnalytics: apiBaseUrl + '/users/teacher/analytics/',
    adminTeachersUnpublish: apiBaseUrl + '/users/admin/teachers',
}


export function extractYouTubeVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return match ? match[1] : null;
}


export function getStatusColor (status) {
    switch (status) {
      case 'yes':
        return 'schválené';
      case 'no':
        return 'čaká na schválenie';
      case 'canceled':
        return 'zrušené';
      default:
        return '-';
    }
  };