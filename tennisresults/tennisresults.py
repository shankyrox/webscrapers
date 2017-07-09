import webbrowser
import argparse

parser = argparse.ArgumentParser(description='Get tournament results')
parser.add_argument('linkId', action='store', type=int, help='Enter link id for tournament results page')
parser.add_argument('-d', action='store', nargs=1, type=str, choices=['b18s', 'g18s', 'b18d', 'g18d'], help='Select one'
                    ' : Boys 18 singles, Girls 18 singles, Boys 18 doubles, Girls 18 doubles')
args = parser.parse_args()
print(str(args.d[0]))
if args.d[0]=='b18s':
    x = 2
elif args.d[0]=='g18s':
    x = 3
elif args.d[0]=='b18d':
    x = 4
elif args.d[0]=='g18d':
    x = 5
else:
    x = 0
webbrowser.open('http://tennislink.usta.com/Tournaments/TournamentHome/Tournament.aspx?T='+str(args.linkId).strip()+'#&&s=8Results'+str(x))
