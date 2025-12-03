"""
Scrapers package for contractor leads SaaS

All scrapers now include:
- Auto-recovery with retry logic
- Comprehensive logging
- Health monitoring
- Partial results saving
- Exponential backoff on failures
"""

# Original 7 cities
from .nashville import NashvillePermitScraper
from .austin import AustinPermitScraper
from .houston import HoustonPermitScraper
from .sanantonio import SanAntonioPermitScraper
from .charlotte import CharlottePermitScraper
from .chattanooga import ChattanoogaPermitScraper
from .phoenix import PhoenixPermitScraper

# New 13 cities
from .atlanta import AtlantaPermitScraper
from .seattle import SeattlePermitScraper
from .sandiego import SanDiegoPermitScraper
from .indianapolis import IndianapolisPermitScraper
from .columbus import ColumbusPermitScraper
from .chicago import ChicagoPermitScraper
from .boston import BostonPermitScraper
from .philadelphia import PhiladelphiaPermitScraper
from .richmond import RichmondPermitScraper
from .milwaukee import MilwaukeePermitScraper
from .omaha import OmahaPermitScraper
from .knoxville import KnoxvillePermitScraper
from .birmingham import BirminghamPermitScraper

__all__ = [
    'NashvillePermitScraper',
    'AustinPermitScraper',
    'HoustonPermitScraper',
    'SanAntonioPermitScraper',
    'CharlottePermitScraper',
    'ChattanoogaPermitScraper',
    'PhoenixPermitScraper',
    'AtlantaPermitScraper',
    'SeattlePermitScraper',
    'SanDiegoPermitScraper',
    'IndianapolisPermitScraper',
    'ColumbusPermitScraper',
    'ChicagoPermitScraper',
    'BostonPermitScraper',
    'PhiladelphiaPermitScraper',
    'RichmondPermitScraper',
    'MilwaukeePermitScraper',
    'OmahaPermitScraper',
    'KnoxvillePermitScraper',
    'BirminghamPermitScraper',
]
