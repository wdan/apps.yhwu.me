import requests
import time
import random
from datetime import date, timedelta as td
from bs4 import BeautifulSoup


class Crawler():

    @classmethod
    def gen_url(cls, day, month, year):
        monthDict = {
                1: 'janvier',
                2: 'fevrier',
                3: 'mars',
                4: 'avril',
                5: 'mai',
                6: 'june',
                7: 'juillet',
                8: 'aout',
                9: 'septembre',
                10: 'octobre',
                11: 'novembre',
                12: 'decembre'
                }
        baseURL = 'http://www.infoclimat.fr/observations-meteo/archives/%s/%s/%s/roissy-charles-de-gaulle/07157.html'
        if int(day) == 1:
            day = str(day) + 'er'
        month = monthDict[int(month)]
        year = str(year)
        return baseURL % (day, month, year)

    @classmethod
    def get_content(cls, url):
        headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
        r = requests.get(url, headers=headers)
        return r.text

    @classmethod
    def parse_content(cls, content):
        soup = BeautifulSoup(content, 'html.parser')
        daylight_time = cls.parse_daylight(soup)
        avg_day_wind_speed = cls.parse_avg_wind_speed(soup)
        return [daylight_time, avg_day_wind_speed]

    @classmethod
    def parse_daylight(cls, soup):
        recap_day = soup.find_all('table', class_='tableau-recap-day')
        daylight_time_str = recap_day[0].contents[7].contents[3].text
        daylight_time_list = daylight_time_str.split(' ')
        hours = int(daylight_time_list[0][:-1])
        mins = int(daylight_time_list[1][:-3])
        total_mins = hours * 60 + mins
        return total_mins

    @classmethod
    def parse_avg_wind_speed(cls, soup):
        head_info = soup.find_all('tr', class_='degrade-vertical-gris')[0]
        wind_index = 7
        for index, content in enumerate(head_info.contents):
            if 'Vent' in content.text:
                wind_index = index
                break
        avg_hour_speed_list = []
        for i in xrange(24):
            idName = 'cdata' + str(i)
            hour_data = soup.find_all('tr', id=idName)[0]
            avg_hour_wind_speed = hour_data.contents[wind_index].text.split('(')[0].split(' ')[0]
            avg_hour_speed_list.append(float(avg_hour_wind_speed))
        avg_day_wind_speed = reduce(lambda x, y: x + y, avg_hour_speed_list) / len(avg_hour_speed_list)
        return avg_day_wind_speed


    @classmethod
    def gen_date_list(cls, stDay, stMon, stYear, edDay, edMon, edYear):
        date_list = []
        stDay = date(stYear, stMon, stDay)
        edDay = date(edYear, edMon, edDay)
        delta = edDay - stDay
        for i in xrange(delta.days + 1):
            curDate = stDay + td(days=i)
            date_list.append([curDate.day, curDate.month, curDate.year])
        return date_list

    @classmethod
    def get_daily_data(cls, day, month, year):
        url = cls.gen_url(day, month, year)
        content = cls.get_content(url)
        daily_data = cls.parse_content(content)
        return daily_data

    if __name__ == '__main__':
        date_list = gen_date_list(7, 1, 2016, 8, 8, 2016)
        for date_tuple in date_list:
            # time.sleep(random.randint(0, 3))
            day = str(date_tuple[0])
            month = str(date_tuple[1])
            year = str(date_tuple[2])
            url = gen_url(day, month, year)
            content = get_content(url)
            daily_data = parse_content(content)
            daily_sunshine_time = str(daily_data[0])
            daily_avg_wind_speed = str(daily_data[1])
            print "%s-%s-%s: sunshine: %s mins; avg. wind speed: %s km/h." % (year, month, day, daily_sunshine_time, daily_avg_wind_speed)
